-- ============================================================================
-- IN WOOD — приватний список дилерів/лідів власниці (/portal/dealers):
-- контакти, статус перемовин, за потреби логін/пароль від кабінету, якщо
-- створено. Бачить і редагує лише власниця (is_owner) — не staff/менеджери.
-- Виконати цілком у Supabase Dashboard → SQL Editor.
-- ============================================================================

-- SECURITY DEFINER — щоб уникнути рекурсії RLS на самій таблиці profiles
-- (той самий прийом, що й has_salary_access у 0024).
create or replace function public.is_portal_owner()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select coalesce((select is_owner from public.profiles where id = auth.uid()), false);
$$;

create table if not exists public.dealer_notes (
  id uuid primary key default gen_random_uuid(),
  dealer_name text not null default '',
  company_name text not null default '',
  address text not null default '',
  phone text not null default '',
  manager text not null default '',
  contract_form text not null default '',
  models_discussed text not null default '',
  last_contact_date date,
  email text not null default '',
  comment text not null default '',
  portal_login text not null default '',
  portal_password text not null default '',
  sort_order integer not null default 0,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

comment on table public.dealer_notes is
  'Приватний список дилерів/лідів власниці (/portal/dealers) — контакти, '
  'статус перемовин, за потреби логін/пароль від кабінету партнерського '
  'порталу, якщо створено. Бачить і редагує лише is_owner.';

alter table public.dealer_notes enable row level security;

drop policy if exists "dealer_notes_owner_only" on public.dealer_notes;
create policy "dealer_notes_owner_only"
  on public.dealer_notes for all
  using (public.is_portal_owner())
  with check (public.is_portal_owner());

grant select, insert, update, delete on public.dealer_notes to authenticated;

-- Початкові записи (перенесені з Excel-таблиці власниці) навмисно НЕ включені
-- в цю міграцію — реальні телефони/email не мають лежати в git-репозиторії.
-- Їх можна або додати вручну через кнопку "+ Додати дилера" на /portal/dealers,
-- або одноразово імпортувати окремим SQL-файлом поза репозиторієм.
