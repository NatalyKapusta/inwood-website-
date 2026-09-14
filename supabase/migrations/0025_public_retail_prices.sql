-- ============================================================================
-- IN WOOD — публічна сторінка "Фурнітура" на сайті: відкриваємо анонімним
-- відвідувачам ТІЛЬКИ роздрібні ('retail') рядки з трьох таблиць порталу.
-- Тарифи для дилерів/дистриб'юторів/забудовників/Епіцентру/експорту лишаються
-- недоступні анонімному користувачу — політики нижче лише ДОДАЮТЬ видимість
-- retail-рядків (RLS-політики об'єднуються через OR), не змінюючи існуючих.
-- Виконати цілком у Supabase Dashboard → SQL Editor (після 0024).
-- ============================================================================

-- 1. Фурнітура (ручки/накладки/завіси/... ) — уся роздрібна фурнітура публічна.
drop policy if exists "hardware_select_public_retail" on public.hardware_tariff_prices;
create policy "hardware_select_public_retail"
  on public.hardware_tariff_prices for select
  to anon, authenticated
  using (tariff = 'retail');

-- 2. Погонажні вироби (короб/лиштва/добір окремо від полотна) — уся роздрібна
--    видача публічна.
drop policy if exists "line_addons_select_public_retail" on public.line_addon_prices;
create policy "line_addons_select_public_retail"
  on public.line_addon_prices for select
  to anon, authenticated
  using (tariff = 'retail');

-- 3. Плінтус і дверна накладка лежать у product_tariff_prices разом з іншими
--    кодами (варіанти полотна тощо) — відкриваємо публічно лише рядки з
--    префіксом "PLINTUS — " / "NAKLADKA — ", а не всю таблицю.
drop policy if exists "tariff_prices_select_public_flat_line" on public.product_tariff_prices;
create policy "tariff_prices_select_public_flat_line"
  on public.product_tariff_prices for select
  to anon, authenticated
  using (
    tariff = 'retail'
    and (product_code like 'PLINTUS — %' or product_code like 'NAKLADKA — %')
  );
