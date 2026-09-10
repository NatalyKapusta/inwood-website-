-- ============================================================================
-- IN WOOD — каталог фурнітури (ручки, накладки, завіси, механізми, циліндри,
-- розсувні системи, аксесуари) з цінами по тарифу — для конструктора КП.
-- Джерело: прайс-лист постачальника МВМ (бренди MVM, ABUS, AGB/Buonelle),
-- дилерські ціни звірені з внутрішніми калькуляторами вручну.
-- Виконати цілком у Supabase Dashboard → SQL Editor (після 0014).
-- ============================================================================

create table if not exists public.hardware_tariff_prices (
  id bigint generated always as identity primary key,
  brand text not null check (brand in ('MVM', 'AGB_BUONELLE', 'ABUS')),
  category text not null
    check (category in (
      'ruchky', 'nakladky', 'zavisy', 'upory', 'mekhanizmy',
      'tsylindry', 'rozsuvna', 'aksesuary', 'inshe'
    )),
  article text not null,
  name text not null,
  material text not null default '',
  tariff text not null
    check (tariff in ('retail', 'dealer', 'distributor', 'builder', 'epicenter', 'export')),
  price numeric(10, 2) not null,
  unique (brand, article, tariff)
);

comment on table public.hardware_tariff_prices is
  'Фурнітура (ручки/накладки/завіси/упори/механізми/циліндри/розсувні системи/аксесуари) '
  'з цінами по тарифу — додаткові позиції в конструкторі КП, не прив''язані до конкретної лінії дверей.';

alter table public.hardware_tariff_prices enable row level security;

drop policy if exists "hardware_select_by_role" on public.hardware_tariff_prices;
create policy "hardware_select_by_role"
  on public.hardware_tariff_prices for select
  using (
    case public.current_user_role()
      when 'staff' then true
      when 'manager' then true
      when 'dealer_distributor' then tariff in ('retail', 'dealer', 'distributor')
      when 'dealer' then tariff = 'dealer'
      when 'epicenter' then tariff = 'epicenter'
      when 'distributor' then tariff = 'distributor'
      when 'builder' then tariff = 'builder'
      when 'export' then tariff = 'export'
      else false
    end
  );

drop policy if exists "hardware_write_staff" on public.hardware_tariff_prices;
create policy "hardware_write_staff"
  on public.hardware_tariff_prices for all
  using (public.current_user_role() = 'staff')
  with check (public.current_user_role() = 'staff');
