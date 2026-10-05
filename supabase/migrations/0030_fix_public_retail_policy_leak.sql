-- ============================================================================
-- IN WOOD — фікс витоку роздрібних цін дилерам через публічні RLS-політики.
--
-- 0025_public_retail_prices.sql відкрив тариф 'retail' у трьох таблицях
-- ролі "to anon, authenticated" — малось на увазі лише для анонімних
-- відвідувачів публічних сторінок сайту (/furnitura, вкладка "Погонажні
-- вироби" в /catalog). Але слово "authenticated" у Postgres означає БУДЬ-
-- ЯКОГО залогіненого користувача — включно з дилерами в партнерському
-- порталі. RLS-політики об'єднуються через OR, тож ця публічна політика
-- додавалась до власної (правильної) політики дилера — і діставала
-- 'retail'-рядки й туди, куди не повинна була:
--
--   - line_addon_prices: дилер бачив РОЗДРІБНІ ціни короба/лиштви/добору
--     для БУДЬ-ЯКОЇ колекції (ця політика взагалі без обмеження по колекції).
--   - product_tariff_prices: дилер бачив, що тариф 'retail' існує (через
--     рядки PLINTUS/NAKLADKA), тариф "Роздрібна" з'являвся в селекті —
--     хоча реальної ціни на полотно дилер все одно не бачив (звідси 0,00 ₴
--     замість справжньої ціни NL-05 у скріншотах Валентини 05.10.2026).
--   - hardware_tariff_prices: та сама діра для роздрібної фурнітури.
--
-- Фікс: прибираємо "authenticated" з цих трьох публічних політик — лишається
-- лише "anon". Залогінені користувачі порталу й так мають власні правильні
-- rolе-based політики (tariff_prices_select_by_role, line_addons_select_by_role,
-- hardware_select_by_role) — публічний анонімний доступ їм не потрібен.
-- Виконати цілком у Supabase Dashboard → SQL Editor.
-- ============================================================================

drop policy if exists "hardware_select_public_retail" on public.hardware_tariff_prices;
create policy "hardware_select_public_retail"
  on public.hardware_tariff_prices for select
  to anon
  using (tariff = 'retail');

drop policy if exists "line_addons_select_public_retail" on public.line_addon_prices;
create policy "line_addons_select_public_retail"
  on public.line_addon_prices for select
  to anon
  using (tariff = 'retail');

drop policy if exists "tariff_prices_select_public_flat_line" on public.product_tariff_prices;
create policy "tariff_prices_select_public_flat_line"
  on public.product_tariff_prices for select
  to anon
  using (
    tariff = 'retail'
    and (product_code like 'PLINTUS — %' or product_code like 'NAKLADKA — %')
  );
