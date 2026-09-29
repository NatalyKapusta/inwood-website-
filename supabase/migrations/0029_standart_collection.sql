-- ============================================================================
-- IN WOOD — колекція STANDART (ТЗ 29.09.2026): ціни моделей ST-1.1…ST-3.4
-- та короб/лиштва/добір. Тільки для B2B-калькулятора — на публічний
-- каталог не виводиться (не входить у collectionOrder, lib/products.ts).
-- Тарифи: dealer/retail/distributor/export (без builder/epicenter —
-- замовниця підтвердила, що для цієї лінії їх немає).
-- Виконати цілком у Supabase Dashboard → SQL Editor.
-- ============================================================================

insert into public.product_tariff_prices (product_code, tariff, price) values
  ('ST-1.1', 'dealer', 6279.0), ('ST-1.1', 'retail', 8970.0), ('ST-1.1', 'distributor', 5382.0), ('ST-1.1', 'export', 5232.5),
  ('ST-1.2', 'dealer', 6279.0), ('ST-1.2', 'retail', 8970.0), ('ST-1.2', 'distributor', 5382.0), ('ST-1.2', 'export', 5232.5),
  ('ST-1.3', 'dealer', 6279.0), ('ST-1.3', 'retail', 8970.0), ('ST-1.3', 'distributor', 5382.0), ('ST-1.3', 'export', 5232.5),
  ('ST-1.4', 'dealer', 6279.0), ('ST-1.4', 'retail', 8970.0), ('ST-1.4', 'distributor', 5382.0), ('ST-1.4', 'export', 5232.5),
  ('ST-1.5', 'dealer', 6279.0), ('ST-1.5', 'retail', 8970.0), ('ST-1.5', 'distributor', 5382.0), ('ST-1.5', 'export', 5232.5),
  ('ST-1.6', 'dealer', 6279.0), ('ST-1.6', 'retail', 8970.0), ('ST-1.6', 'distributor', 5382.0), ('ST-1.6', 'export', 5232.5),
  ('ST-1.7', 'dealer', 6279.0), ('ST-1.7', 'retail', 8970.0), ('ST-1.7', 'distributor', 5382.0), ('ST-1.7', 'export', 5232.5),
  ('ST-2.1', 'dealer', 7744.1), ('ST-2.1', 'retail', 11063.0), ('ST-2.1', 'distributor', 6637.8), ('ST-2.1', 'export', 6453.42),
  ('ST-2.2', 'dealer', 7744.1), ('ST-2.2', 'retail', 11063.0), ('ST-2.2', 'distributor', 6637.8), ('ST-2.2', 'export', 6453.42),
  ('ST-2.3', 'dealer', 7744.1), ('ST-2.3', 'retail', 11063.0), ('ST-2.3', 'distributor', 6637.8), ('ST-2.3', 'export', 6453.42),
  ('ST-2.4', 'dealer', 7744.1), ('ST-2.4', 'retail', 11063.0), ('ST-2.4', 'distributor', 6637.8), ('ST-2.4', 'export', 6453.42),
  ('ST-2.5', 'dealer', 7744.1), ('ST-2.5', 'retail', 11063.0), ('ST-2.5', 'distributor', 6637.8), ('ST-2.5', 'export', 6453.42),
  ('ST-2.6', 'dealer', 7744.1), ('ST-2.6', 'retail', 11063.0), ('ST-2.6', 'distributor', 6637.8), ('ST-2.6', 'export', 6453.42),
  ('ST-2.7', 'dealer', 7744.1), ('ST-2.7', 'retail', 11063.0), ('ST-2.7', 'distributor', 6637.8), ('ST-2.7', 'export', 6453.42),
  ('ST-3.1', 'dealer', 6405.0), ('ST-3.1', 'retail', 9150.0), ('ST-3.1', 'distributor', 5490.0), ('ST-3.1', 'export', 5337.5),
  ('ST-3.2', 'dealer', 6405.0), ('ST-3.2', 'retail', 9150.0), ('ST-3.2', 'distributor', 5490.0), ('ST-3.2', 'export', 5337.5),
  ('ST-3.3', 'dealer', 6405.0), ('ST-3.3', 'retail', 9150.0), ('ST-3.3', 'distributor', 5490.0), ('ST-3.3', 'export', 5337.5),
  ('ST-3.4', 'dealer', 6405.0), ('ST-3.4', 'retail', 9150.0), ('ST-3.4', 'distributor', 5490.0), ('ST-3.4', 'export', 5337.5)
on conflict do nothing;

insert into public.line_addon_prices (collection, addon_type, item_label, tariff, price) values
  ('standart', 'korob', 'Телескопічний 80 мм (STANDART)', 'dealer', 2061.5),
  ('standart', 'korob', 'Телескопічний 80 мм (STANDART)', 'retail', 2945.0),
  ('standart', 'korob', 'Телескопічний 80 мм (STANDART)', 'distributor', 1767.0),
  ('standart', 'korob', 'Телескопічний 80 мм (STANDART)', 'export', 1717.92),
  ('standart', 'korob', 'Телескопічний 100 мм (STANDART)', 'dealer', 2748.2),
  ('standart', 'korob', 'Телескопічний 100 мм (STANDART)', 'retail', 3926.0),
  ('standart', 'korob', 'Телескопічний 100 мм (STANDART)', 'distributor', 2355.6),
  ('standart', 'korob', 'Телескопічний 100 мм (STANDART)', 'export', 2290.17),
  ('standart', 'korob', 'Телескопічний 120 мм (STANDART)', 'dealer', 3015.6),
  ('standart', 'korob', 'Телескопічний 120 мм (STANDART)', 'retail', 4308.0),
  ('standart', 'korob', 'Телескопічний 120 мм (STANDART)', 'distributor', 2584.8),
  ('standart', 'korob', 'Телескопічний 120 мм (STANDART)', 'export', 2513.0),
  ('standart', 'lishtva', 'Телескопічна 80 мм (STANDART)', 'dealer', 894.6),
  ('standart', 'lishtva', 'Телескопічна 80 мм (STANDART)', 'retail', 1278.0),
  ('standart', 'lishtva', 'Телескопічна 80 мм (STANDART)', 'distributor', 766.8),
  ('standart', 'lishtva', 'Телескопічна 80 мм (STANDART)', 'export', 745.5),
  ('standart', 'lishtva', 'Телескопічна 80 мм (крило 40 мм) (STANDART)', 'dealer', 1078.7),
  ('standart', 'lishtva', 'Телескопічна 80 мм (крило 40 мм) (STANDART)', 'retail', 1541.0),
  ('standart', 'lishtva', 'Телескопічна 80 мм (крило 40 мм) (STANDART)', 'distributor', 924.6),
  ('standart', 'lishtva', 'Телескопічна 80 мм (крило 40 мм) (STANDART)', 'export', 898.92),
  ('standart', 'dobir', 'Телескопічний 100 мм (STANDART)', 'dealer', 788.2),
  ('standart', 'dobir', 'Телескопічний 100 мм (STANDART)', 'retail', 1126.0),
  ('standart', 'dobir', 'Телескопічний 100 мм (STANDART)', 'distributor', 675.6),
  ('standart', 'dobir', 'Телескопічний 100 мм (STANDART)', 'export', 656.83),
  ('standart', 'dobir', 'Телескопічний 150 мм (STANDART)', 'dealer', 1029.0),
  ('standart', 'dobir', 'Телескопічний 150 мм (STANDART)', 'retail', 1470.0),
  ('standart', 'dobir', 'Телескопічний 150 мм (STANDART)', 'distributor', 882.0),
  ('standart', 'dobir', 'Телескопічний 150 мм (STANDART)', 'export', 857.5),
  ('standart', 'dobir', 'Телескопічний 200 мм (STANDART)', 'dealer', 1508.5),
  ('standart', 'dobir', 'Телескопічний 200 мм (STANDART)', 'retail', 2155.0),
  ('standart', 'dobir', 'Телескопічний 200 мм (STANDART)', 'distributor', 1293.0),
  ('standart', 'dobir', 'Телескопічний 200 мм (STANDART)', 'export', 1257.08)
on conflict do nothing;
