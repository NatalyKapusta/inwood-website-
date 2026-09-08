-- ============================================================================
-- IN WOOD — схема закритого B2B-порталу (профілі, ролі, ціни за тарифами)
-- Виконати цілком у Supabase Dashboard → SQL Editor.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. ПРОФІЛІ КОРИСТУВАЧІВ (роль визначає, які тарифи бачить людина)
-- ----------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  full_name text,
  company_name text,
  role text not null default 'dealer'
    check (role in ('dealer', 'dealer_distributor', 'staff')),
  created_at timestamptz not null default now()
);

comment on table public.profiles is
  'Профіль партнера/співробітника. role визначає видимість тарифів: '
  'dealer — лише дилерський тариф; '
  'dealer_distributor — роздрібний + дилерський + дистриб''юторський; '
  'staff — усі 6 тарифів + ручне перевизначення ціни/розміру.';

alter table public.profiles enable row level security;

-- Хелпер: роль поточного користувача. SECURITY DEFINER — щоб уникнути
-- рекурсії RLS-політик на самій таблиці profiles.
create or replace function public.current_user_role()
returns text
language sql
security definer
set search_path = public
stable
as $$
  select role from public.profiles where id = auth.uid();
$$;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
  on public.profiles for select
  using (id = auth.uid());

drop policy if exists "profiles_select_staff_all" on public.profiles;
create policy "profiles_select_staff_all"
  on public.profiles for select
  using (public.current_user_role() = 'staff');

-- Створення/редагування профілів робиться через адмін-клієнт (secret key,
-- в обхід RLS) з боку сервера, коли ВИ надаєте доступ конкретній людині —
-- тому окремих insert/update policy для звичайних користувачів немає.

-- Автоматично створюємо порожній профіль (роль за замовчуванням "dealer")
-- одразу при появі нового auth.users — щоб профіль завжди існував.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ----------------------------------------------------------------------------
-- 2. ЦІНИ ЗА ТАРИФАМИ (product_code — той самий код товару, що й у
--    data/products.json на сайті; окрема таблиця, бо роздрібні ціни й так
--    публічні та живуть у статичному JSON)
-- ----------------------------------------------------------------------------
create table if not exists public.product_tariff_prices (
  id bigint generated always as identity primary key,
  product_code text not null,
  tariff text not null
    check (tariff in ('retail', 'dealer', 'distributor', 'builder', 'epicenter', 'export')),
  price numeric(10, 2) not null,
  updated_at timestamptz not null default now(),
  unique (product_code, tariff)
);

comment on table public.product_tariff_prices is
  'Ціна товару для кожного з 6 тарифів. Видимість рядків обмежена RLS '
  'відповідно до ролі користувача.';

alter table public.product_tariff_prices enable row level security;

drop policy if exists "tariff_prices_select_by_role" on public.product_tariff_prices;
create policy "tariff_prices_select_by_role"
  on public.product_tariff_prices for select
  using (
    case public.current_user_role()
      when 'staff' then true
      when 'dealer_distributor' then tariff in ('retail', 'dealer', 'distributor')
      when 'dealer' then tariff = 'dealer'
      else false
    end
  );

-- Змінювати ціни можуть лише staff.
drop policy if exists "tariff_prices_write_staff" on public.product_tariff_prices;
create policy "tariff_prices_write_staff"
  on public.product_tariff_prices for all
  using (public.current_user_role() = 'staff')
  with check (public.current_user_role() = 'staff');

-- ----------------------------------------------------------------------------
-- 3. РУЧНЕ ПЕРЕВИЗНАЧЕННЯ ЦІНИ/РОЗМІРУ (ексклюзивно для staff)
-- ----------------------------------------------------------------------------
create table if not exists public.price_overrides (
  id bigint generated always as identity primary key,
  product_code text not null,
  custom_price numeric(10, 2),
  custom_size_note text,
  comment text,
  created_by uuid references public.profiles (id),
  created_at timestamptz not null default now()
);

comment on table public.price_overrides is
  'Ручні перевизначення ціни/розміру для нестандартних замовлень — '
  'створює й бачить лише роль staff.';

alter table public.price_overrides enable row level security;

drop policy if exists "price_overrides_staff_only" on public.price_overrides;
create policy "price_overrides_staff_only"
  on public.price_overrides for all
  using (public.current_user_role() = 'staff')
  with check (public.current_user_role() = 'staff');
