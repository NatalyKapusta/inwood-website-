-- ============================================================================
-- IN WOOD — Плінтус і Дверна накладка (метал. двері, 10 мм): ціни по тарифах.
-- Витягнуто з оригінального калькулятора (PLINTUS/NAKLADKA), перенесено в
-- product_tariff_prices з префіксом, щоб не перетиналось з кодами моделей дверей.
-- Виконати цілком у Supabase Dashboard → SQL Editor.
-- ============================================================================

insert into public.product_tariff_prices (product_code, tariff, price) values
  ('PLINTUS — Плінтус 80 х 8 х 2070 мм, ціна за 1 пог.м', 'retail', 230),
  ('PLINTUS — Плінтус 80 х 8 х 2070 мм, ціна за 1 пог.м', 'dealer', 161),
  ('PLINTUS — Плінтус 80 х 8 х 2070 мм, ціна за 1 пог.м', 'distributor', 138),
  ('PLINTUS — Плінтус 80 х 8 х 2070 мм, ціна за 1 пог.м', 'builder', 184),
  ('PLINTUS — Плінтус 80 х 8 х 2070 мм, ціна за 1 пог.м', 'export', 134.17),
  ('PLINTUS — Плінтус 80 х 8 х 2070 мм, ціна за 1 пог.м', 'epicenter', 176.64),
  ('NAKLADKA — Etalon 01, Nominal 01, 10 мм', 'retail', 3700),
  ('NAKLADKA — Etalon 01, Nominal 01, 10 мм', 'dealer', 2590),
  ('NAKLADKA — Etalon 01, Nominal 01, 10 мм', 'distributor', 2220),
  ('NAKLADKA — Etalon 01, Nominal 01, 10 мм', 'builder', 2960),
  ('NAKLADKA — Etalon 01, Nominal 01, 10 мм', 'export', 2158.33),
  ('NAKLADKA — Etalon 01, Nominal 01, 10 мм', 'epicenter', 2841.6),
  ('NAKLADKA — Etalon 02-17, 10 мм', 'retail', 4150),
  ('NAKLADKA — Etalon 02-17, 10 мм', 'dealer', 2905),
  ('NAKLADKA — Etalon 02-17, 10 мм', 'distributor', 2490),
  ('NAKLADKA — Etalon 02-17, 10 мм', 'builder', 3320),
  ('NAKLADKA — Etalon 02-17, 10 мм', 'export', 2420.83),
  ('NAKLADKA — Etalon 02-17, 10 мм', 'epicenter', 3187.2),
  ('NAKLADKA — Nominal 02-10, 10 мм', 'retail', 3400),
  ('NAKLADKA — Nominal 02-10, 10 мм', 'dealer', 2380),
  ('NAKLADKA — Nominal 02-10, 10 мм', 'distributor', 2040),
  ('NAKLADKA — Nominal 02-10, 10 мм', 'builder', 2720),
  ('NAKLADKA — Nominal 02-10, 10 мм', 'export', 1983.33),
  ('NAKLADKA — Nominal 02-10, 10 мм', 'epicenter', 2611.2),
  ('NAKLADKA — Frezzatti 01-14, 10 мм', 'retail', 3800),
  ('NAKLADKA — Frezzatti 01-14, 10 мм', 'dealer', 2660),
  ('NAKLADKA — Frezzatti 01-14, 10 мм', 'distributor', 2280),
  ('NAKLADKA — Frezzatti 01-14, 10 мм', 'builder', 3040),
  ('NAKLADKA — Frezzatti 01-14, 10 мм', 'export', 2216.67),
  ('NAKLADKA — Frezzatti 01-14, 10 мм', 'epicenter', 2918.4),
  ('NAKLADKA — Perfetto 01-02, 10 мм', 'retail', 4820),
  ('NAKLADKA — Perfetto 01-02, 10 мм', 'dealer', 3374),
  ('NAKLADKA — Perfetto 01-02, 10 мм', 'distributor', 2892),
  ('NAKLADKA — Perfetto 01-02, 10 мм', 'builder', 3856),
  ('NAKLADKA — Perfetto 01-02, 10 мм', 'export', 2811.67),
  ('NAKLADKA — Perfetto 01-02, 10 мм', 'epicenter', 3701.76)
on conflict (product_code, tariff) do update set price = excluded.price, updated_at = now();
