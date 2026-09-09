-- ============================================================================
-- IN WOOD — окремі ролі для епіцентру, дистриб'ютора, забудовника та
-- експорту — кожна бачить лише свій тариф, за тією ж логікою, що й dealer.
-- (dealer_distributor лишається окремо — це роль із трьома тарифами.)
-- Виконати цілком у Supabase Dashboard → SQL Editor.
-- ============================================================================

alter table public.profiles drop constraint if exists profiles_role_check;
alter table public.profiles add constraint profiles_role_check
  check (role in (
    'dealer', 'dealer_distributor', 'manager', 'staff',
    'epicenter', 'distributor', 'builder', 'export'
  ));

comment on table public.profiles is
  'Профіль партнера/співробітника. role визначає видимість тарифів: '
  'dealer — лише дилерський тариф; '
  'dealer_distributor — роздрібний + дилерський + дистриб''юторський; '
  'epicenter — лише тариф "Епіцентр"; '
  'distributor — лише дистриб''юторський тариф; '
  'builder — лише тариф "Забудовник"; '
  'export — лише експортний тариф; '
  'manager — усі 6 тарифів, конструктор КП без ручного перевизначення; '
  'staff — усі 6 тарифів + ручне перевизначення ціни/розміру + керування порталом.';

drop policy if exists "tariff_prices_select_by_role" on public.product_tariff_prices;
create policy "tariff_prices_select_by_role"
  on public.product_tariff_prices for select
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

drop policy if exists "line_addons_select_by_role" on public.line_addon_prices;
create policy "line_addons_select_by_role"
  on public.line_addon_prices for select
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

drop policy if exists "services_select_by_role" on public.service_tariff_prices;
create policy "services_select_by_role"
  on public.service_tariff_prices for select
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
