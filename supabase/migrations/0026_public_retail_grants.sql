-- 0025 додав RLS-політики "select ... to anon using (tariff = 'retail')" на
-- hardware_tariff_prices / line_addon_prices / product_tariff_prices, але
-- сам GRANT SELECT на ці таблиці існував лише для ролі authenticated
-- (0007/0017) — без базового GRANT для anon RLS-політика нічого не дає,
-- тому публічні сторінки (/furnitura, вкладка "Погонажні вироби" в
-- /catalog) отримували порожній результат попри правильну політику.

grant select on public.hardware_tariff_prices to anon;
grant select on public.line_addon_prices to anon;
grant select on public.product_tariff_prices to anon;
