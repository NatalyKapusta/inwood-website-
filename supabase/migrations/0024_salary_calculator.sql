-- ============================================================================
-- IN WOOD — калькулятор ЗП/комісійних менеджерів з продажу, окремою
-- сторінкою закритого порталу з обмеженим доступом (не всі staff/owner,
-- а конкретні люди, яким власник відкрив прапорець salary_access).
-- Виконати цілком у Supabase Dashboard → SQL Editor.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. ДОСТУП: окремий прапорець на профілі, не пов'язаний з роллю/is_owner —
--    щоб можна було дати доступ до ЗП одній-двом конкретним людям, а не
--    всім staff.
-- ----------------------------------------------------------------------------
alter table public.profiles add column if not exists salary_access boolean not null default false;

comment on column public.profiles.salary_access is
  'true — ця людина бачить і може редагувати сторінку "Зарплата" (/portal/salary). '
  'Окремо від is_owner і role — власник вмикає точково, кому треба.';

update public.profiles set salary_access = true where email = 'hodes.nv@gmail.com';

-- SECURITY DEFINER — щоб уникнути рекурсії RLS на самій таблиці profiles.
create or replace function public.has_salary_access()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select coalesce((select salary_access or is_owner from public.profiles where id = auth.uid()), false);
$$;

-- ----------------------------------------------------------------------------
-- 2. ЛЮДИ (менеджери з продажу) — одна картка на менеджера в межах періоду.
-- ----------------------------------------------------------------------------
create table if not exists public.salary_people (
  id uuid primary key default gen_random_uuid(),
  period text not null default '',
  name text not null default '',
  note text not null default '',
  mode text not null default 'plan' check (mode in ('percent', 'split', 'plan', 'manual')),
  rate numeric not null default 0,
  rate_new numeric not null default 0,
  rate_old numeric not null default 0,
  plan_target numeric not null default 0,
  plan_met boolean not null default true,
  manual_amount numeric not null default 0,
  sort_order integer not null default 0,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

comment on table public.salary_people is
  'Одна картка менеджера з продажу для калькулятора комісійних '
  '(/portal/salary). mode визначає, як рахується комісія: '
  'percent — % від усього обороту (rate); '
  'split — окремо нові (rate_new) і старі (rate_old) замовлення; '
  'plan — rate%, якщо оборот >= plan_target (або ручний перемикач plan_met, '
  'коли ціль не задана), інакше manual_amount; '
  'manual — сума виплати вводиться напряму (manual_amount).';

-- ----------------------------------------------------------------------------
-- 3. ЗАМОВЛЕННЯ — рядки в межах картки менеджера.
-- ----------------------------------------------------------------------------
create table if not exists public.salary_orders (
  id uuid primary key default gen_random_uuid(),
  person_id uuid not null references public.salary_people (id) on delete cascade,
  order_date date,
  comment text not null default '',
  amount numeric not null default 0,
  kind text not null default 'new' check (kind in ('new', 'old')),
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

comment on table public.salary_orders is
  'Замовлення в межах картки менеджера (salary_people). kind ("new"/"old") '
  'має значення лише в режимі mode=''split''.';

alter table public.salary_people enable row level security;
alter table public.salary_orders enable row level security;

drop policy if exists "salary_people_access" on public.salary_people;
create policy "salary_people_access"
  on public.salary_people for all
  using (public.has_salary_access())
  with check (public.has_salary_access());

drop policy if exists "salary_orders_access" on public.salary_orders;
create policy "salary_orders_access"
  on public.salary_orders for all
  using (public.has_salary_access())
  with check (public.has_salary_access());

-- ----------------------------------------------------------------------------
-- 4. ПРАВА (GRANT) — без цього RLS навіть не спрацює, Postgres відмовить
--    ще на рівні "permission denied for table" (той самий урок, що й з
--    hardware_tariff_prices у міграції 0017).
-- ----------------------------------------------------------------------------
grant select, insert, update, delete on public.salary_people to authenticated;
grant select, insert, update, delete on public.salary_orders to authenticated;

-- ----------------------------------------------------------------------------
-- 5. ПОЧАТКОВІ ДАНІ — реальні цифри за серпень 2026, ті самі, що вже
--    перевірені у власниці (щоб сторінка одразу відкрилась із живими даними,
--    а не порожньою).
-- ----------------------------------------------------------------------------
do $$
declare
  v_bogdan uuid;
  v_seed_needed boolean;
  v_sasha uuid;
  v_yakubovskyi uuid;
  v_andriy uuid;
begin
  -- Безпечно повторно запустити цю міграцію — не дублюємо приклад-дані,
  -- якщо в таблиці вже щось є (свіжа порожня база чи ще один прогін).
  select not exists(select 1 from public.salary_people) into v_seed_needed;
  if not v_seed_needed then
    return;
  end if;

  insert into public.salary_people (period, name, note, mode, rate, sort_order)
  values ('Серпень 2026', 'Богдан Ігор', 'Епіцентр', 'percent', 4, 1)
  returning id into v_bogdan;

  insert into public.salary_orders (person_id, comment, amount, sort_order) values
    (v_bogdan, 'ІВ-326', 15846, 1),
    (v_bogdan, 'ІВ-327', 14646, 2),
    (v_bogdan, 'ІВ-332', 34808, 3),
    (v_bogdan, 'ІВ-336', 10023, 4),
    (v_bogdan, 'ІВ-339', 35335, 5),
    (v_bogdan, 'ІВ-341', 37215, 6),
    (v_bogdan, 'ІВ-342', 56852.6, 7);

  insert into public.salary_people (period, name, note, mode, rate_new, rate_old, sort_order)
  values ('Серпень 2026', 'Пшеченко Олександр', 'Саша', 'split', 2, 1, 2)
  returning id into v_sasha;

  insert into public.salary_orders (person_id, comment, amount, kind, sort_order) values
    (v_sasha, 'ІВ-333', 498177, 'old', 1),
    (v_sasha, 'Domatek', 133271, 'new', 2),
    (v_sasha, 'MB „GRINDUPĖ”', 43243, 'new', 3);

  insert into public.salary_people (period, name, mode, rate, plan_met, sort_order)
  values ('Серпень 2026', 'Якубовський Олександр', 'plan', 2.5, true, 3)
  returning id into v_yakubovskyi;

  insert into public.salary_orders (person_id, comment, amount, sort_order) values
    (v_yakubovskyi, 'ПА 145', 37324.95, 1),
    (v_yakubovskyi, 'ПА 125', 3888.3, 2),
    (v_yakubovskyi, 'ПА 103', 260.4, 3),
    (v_yakubovskyi, 'ІВ 334', 9500, 4),
    (v_yakubovskyi, 'ІВ 348', 11500, 5),
    (v_yakubovskyi, 'ІВ 345', 47376, 6),
    (v_yakubovskyi, 'ПА 149', 45000, 7),
    (v_yakubovskyi, 'ПА 150', 23000, 8),
    (v_yakubovskyi, 'ПА 151', 23000, 9),
    (v_yakubovskyi, 'ПА 158', 12000, 10),
    (v_yakubovskyi, 'ПА 155', 10000, 11),
    (v_yakubovskyi, 'ПА 154', 10000, 12),
    (v_yakubovskyi, 'ПА 153', 41774, 13),
    (v_yakubovskyi, 'ПА 152', 16000, 14),
    (v_yakubovskyi, 'ПА 107', 2990, 15),
    (v_yakubovskyi, 'ПА 113', 25862, 16),
    (v_yakubovskyi, 'ПА 146', 25721.15, 17),
    (v_yakubovskyi, 'ІВ 272', 5870, 18),
    (v_yakubovskyi, 'ІВ 343', 9289, 19),
    (v_yakubovskyi, 'ІВ 247', 12000, 20),
    (v_yakubovskyi, 'ІВ 337', 27048, 21),
    (v_yakubovskyi, 'ПА 144', 10000, 22),
    (v_yakubovskyi, 'ПА 338', 14377, 23),
    (v_yakubovskyi, 'ПА 328', 11500, 24),
    (v_yakubovskyi, 'ПА 140', 8000, 25),
    (v_yakubovskyi, 'ПА 105', 2529.33, 26),
    (v_yakubovskyi, 'ПА 139', 17195.1, 27),
    (v_yakubovskyi, 'ІВ 324', 49408.8, 28),
    (v_yakubovskyi, 'ІВ 323', 37000, 29),
    (v_yakubovskyi, 'ІВ 258', 36771.99, 30),
    (v_yakubovskyi, 'ІВ 322', 15000, 31);

  insert into public.salary_people (period, name, mode, rate, sort_order)
  values ('Серпень 2026', 'Уманець Андрій', 'percent', 1, 4)
  returning id into v_andriy;

  insert into public.salary_orders (person_id, comment, amount, sort_order) values
    (v_andriy, 'Разом за період (деталізація замовлень не збереглась)', 1439548, 1);
end $$;
