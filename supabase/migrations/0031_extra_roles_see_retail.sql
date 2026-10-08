-- ============================================================================
-- IN WOOD — дилер, епіцентр, дистриб'ютор, забудовник та експорт тепер
-- додатково бачать роздрібний тариф (можуть перемикатись між своїм тарифом
-- і роздрібом у калькуляторі КП), так само як dealer_distributor.
-- Виконати цілком у Supabase Dashboard → SQL Editor (після 0014 і 0015).
-- ============================================================================

drop policy if exists "tariff_prices_select_by_role" on public.product_tariff_prices;
create policy "tariff_prices_select_by_role"
  on public.product_tariff_prices for select
  using (
    case public.current_user_role()
      when 'staff' then true
      when 'manager' then true
      when 'dealer_distributor' then tariff in ('retail', 'dealer', 'distributor')
      when 'dealer' then tariff in ('retail', 'dealer')
      when 'epicenter' then tariff in ('retail', 'epicenter')
      when 'distributor' then tariff in ('retail', 'distributor')
      when 'builder' then tariff in ('retail', 'builder')
      when 'export' then tariff in ('retail', 'export')
      else false
    end
  );

drop policy if exists "line_addons_select_by_role" on public.line_addon_prices;
create policy "line_addons_select_by_role"
  on public.line_addon_prices for select
  using (
    case public.current_user_role()
      when 'staff' then true
      when 'manager' then true
      when 'dealer_distributor' then tariff in ('retail', 'dealer', 'distributor')
      when 'dealer' then tariff in ('retail', 'dealer')
      when 'epicenter' then tariff in ('retail', 'epicenter')
      when 'distributor' then tariff in ('retail', 'distributor')
      when 'builder' then tariff in ('retail', 'builder')
      when 'export' then tariff in ('retail', 'export')
      else false
    end
  );

drop policy if exists "services_select_by_role" on public.service_tariff_prices;
create policy "services_select_by_role"
  on public.service_tariff_prices for select
  using (
    case public.current_user_role()
      when 'staff' then true
      when 'manager' then true
      when 'dealer_distributor' then tariff in ('retail', 'dealer', 'distributor')
      when 'dealer' then tariff in ('retail', 'dealer')
      when 'epicenter' then tariff in ('retail', 'epicenter')
      when 'distributor' then tariff in ('retail', 'distributor')
      when 'builder' then tariff in ('retail', 'builder')
      when 'export' then tariff in ('retail', 'export')
      else false
    end
  );

drop policy if exists "hardware_select_by_role" on public.hardware_tariff_prices;
create policy "hardware_select_by_role"
  on public.hardware_tariff_prices for select
  using (
    case public.current_user_role()
      when 'staff' then true
      when 'manager' then true
      when 'dealer_distributor' then tariff in ('retail', 'dealer', 'distributor')
      when 'dealer' then tariff in ('retail', 'dealer')
      when 'epicenter' then tariff in ('retail', 'epicenter')
      when 'distributor' then tariff in ('retail', 'distributor')
      when 'builder' then tariff in ('retail', 'builder')
      when 'export' then tariff in ('retail', 'export')
      else false
    end
  );

comment on table public.profiles is
  'Профіль партнера/співробітника. role визначає видимість тарифів: '
  'dealer — роздрібний + дилерський тариф; '
  'dealer_distributor — роздрібний + дилерський + дистриб''юторський; '
  'epicenter — роздрібний + тариф "Епіцентр"; '
  'distributor — роздрібний + дистриб''юторський тариф; '
  'builder — роздрібний + тариф "Забудовник"; '
  'export — роздрібний + експортний тариф; '
  'manager — усі 6 тарифів, конструктор КП без ручного перевизначення; '
  'staff — усі 6 тарифів + ручне перевизначення ціни/розміру + керування порталом.';
