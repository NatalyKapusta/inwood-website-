-- ============================================================================
-- IN WOOD — конструктор комерційних пропозицій (детальний розпис по позиціях)
-- Виконати цілком у Supabase Dashboard → SQL Editor (після 0001 і 0002).
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. ЦІНИ НА КОРОБ / ЛИШТВУ / ДОБІР по кожній лінії та тарифу
-- ----------------------------------------------------------------------------
create table if not exists public.line_addon_prices (
  id bigint generated always as identity primary key,
  collection text not null,
  addon_type text not null check (addon_type in ('korob', 'lishtva', 'dobir')),
  item_label text not null,
  tariff text not null
    check (tariff in ('retail', 'dealer', 'distributor', 'builder', 'epicenter', 'export')),
  price numeric(10, 2) not null,
  unique (collection, addon_type, item_label, tariff)
);

comment on table public.line_addon_prices is
  'Ціни на короб/лиштву/добір по лінії та тарифу — складові детального розпису КП.';

alter table public.line_addon_prices enable row level security;

drop policy if exists "line_addons_select_by_role" on public.line_addon_prices;
create policy "line_addons_select_by_role"
  on public.line_addon_prices for select
  using (
    case public.current_user_role()
      when 'staff' then true
      when 'dealer_distributor' then tariff in ('retail', 'dealer', 'distributor')
      when 'dealer' then tariff = 'dealer'
      else false
    end
  );

drop policy if exists "line_addons_write_staff" on public.line_addon_prices;
create policy "line_addons_write_staff"
  on public.line_addon_prices for all
  using (public.current_user_role() = 'staff')
  with check (public.current_user_role() = 'staff');

-- ----------------------------------------------------------------------------
-- 2. ФІКСОВАНІ ПОСЛУГИ: врізка (звичайна/алюм. крайка), шумоізоляція,
--    фарбування алюм. крайки, фарбування короба по RAL
-- ----------------------------------------------------------------------------
create table if not exists public.service_tariff_prices (
  id bigint generated always as identity primary key,
  service_key text not null
    check (service_key in (
      'VRIZKA_FULL_PRICE', 'VRIZKA_LOCK_PRICE',
      'VRIZKA_FULL_PRICE_ALU', 'VRIZKA_LOCK_PRICE_ALU',
      'SHUMO_PRICE', 'ALUM_PAINT_PRICE', 'PAINT_KOROB_RAL_PRICE'
    )),
  tariff text not null
    check (tariff in ('retail', 'dealer', 'distributor', 'builder', 'epicenter', 'export')),
  price numeric(10, 2) not null,
  unique (service_key, tariff)
);

comment on table public.service_tariff_prices is
  'Ціни на врізку/шумоізоляцію/фарбування по тарифу (фіксовані послуги, не залежать від лінії).';

alter table public.service_tariff_prices enable row level security;

drop policy if exists "services_select_by_role" on public.service_tariff_prices;
create policy "services_select_by_role"
  on public.service_tariff_prices for select
  using (
    case public.current_user_role()
      when 'staff' then true
      when 'dealer_distributor' then tariff in ('retail', 'dealer', 'distributor')
      when 'dealer' then tariff = 'dealer'
      else false
    end
  );

drop policy if exists "services_write_staff" on public.service_tariff_prices;
create policy "services_write_staff"
  on public.service_tariff_prices for all
  using (public.current_user_role() = 'staff')
  with check (public.current_user_role() = 'staff');

-- ----------------------------------------------------------------------------
-- 3. ЗБЕРЕЖЕНІ КОМЕРЦІЙНІ ПРОПОЗИЦІЇ (історія згенерованих КП)
-- ----------------------------------------------------------------------------
create table if not exists public.quotes (
  id bigint generated always as identity primary key,
  client_name text,
  client_contact text,
  consultant_name text,
  tariff text not null,
  currency text default 'UAH',
  exchange_rate numeric(10, 4),
  discount_type text check (discount_type in ('percent', 'amount')),
  discount_value numeric(10, 2),
  items jsonb not null default '[]'::jsonb,
  subtotal numeric(12, 2),
  total numeric(12, 2),
  created_by uuid references public.profiles (id),
  created_at timestamptz not null default now()
);

comment on table public.quotes is
  'Історія згенерованих комерційних пропозицій — для довідки, хто й коли рахував клієнту.';

alter table public.quotes enable row level security;

-- Кожен бачить лише свої створені КП; staff бачить усі.
drop policy if exists "quotes_select_own_or_staff" on public.quotes;
create policy "quotes_select_own_or_staff"
  on public.quotes for select
  using (created_by = auth.uid() or public.current_user_role() = 'staff');

drop policy if exists "quotes_insert_own" on public.quotes;
create policy "quotes_insert_own"
  on public.quotes for insert
  with check (created_by = auth.uid());
