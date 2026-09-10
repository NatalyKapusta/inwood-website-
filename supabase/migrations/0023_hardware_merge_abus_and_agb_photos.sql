-- ============================================================================
-- IN WOOD — 1) об'єднує лінію ABUS в MVM (той самий постачальник/партнер) —
-- після цього окремої "Фурнітура ABUS" в списку не буде, циліндри ABUS
-- з'являться всередині "Фурнітура MVM" → категорія "Циліндри".
-- 2) додає фото для 11 з 12 позицій AGB/Buonelle — таки вдалось витягнути
-- зі старого .xls-файлу (12-та позиція, 69068, фото в файлі не мала).
-- Виконати цілком у Supabase Dashboard → SQL Editor.
-- ============================================================================

update public.hardware_tariff_prices set brand = 'MVM' where brand = 'ABUS';

update public.hardware_tariff_prices set photo = '/photos/furnitura/agb/45259-agb-art-b024020544-vidpovidna-planka-do.png' where brand = 'AGB_BUONELLE' and article = '45259';
update public.hardware_tariff_prices set photo = '/photos/furnitura/agb/45260-agb-art-b024020593-vidpovidna-planka-do.png' where brand = 'AGB_BUONELLE' and article = '45260';
update public.hardware_tariff_prices set photo = '/photos/furnitura/agb/46604-agb-art-b061025041-mekhanizm-mediana-pol.png' where brand = 'AGB_BUONELLE' and article = '46604';
update public.hardware_tariff_prices set photo = '/photos/furnitura/agb/49127-agb-art-b061025093-mekhanizm-mediana-pol.png' where brand = 'AGB_BUONELLE' and article = '49127';
update public.hardware_tariff_prices set photo = '/photos/furnitura/agb/46605-agb-art-b061035041-mekhanizm-mediana-pol.png' where brand = 'AGB_BUONELLE' and article = '46605';
update public.hardware_tariff_prices set photo = '/photos/furnitura/agb/49128-agb-art-b061035093-mekhanizm-mediana-pol.png' where brand = 'AGB_BUONELLE' and article = '49128';
update public.hardware_tariff_prices set photo = '/photos/furnitura/agb/69067-buonelle-b1968550mb-mekhanizm-zamku-mahni.png' where brand = 'AGB_BUONELLE' and article = '69067';
update public.hardware_tariff_prices set photo = '/photos/furnitura/agb/69063-buonelle-b1968550mc-mekhanizm-zamku-mahni.png' where brand = 'AGB_BUONELLE' and article = '69063';
update public.hardware_tariff_prices set photo = '/photos/furnitura/agb/69064-buonelle-b1969650cm-mekhanizm-mahnitnyi-v.png' where brand = 'AGB_BUONELLE' and article = '69064';
update public.hardware_tariff_prices set photo = '/photos/furnitura/agb/69066-buonelle-b1969650mb-mekhanizm-mahnitnyi-v.png' where brand = 'AGB_BUONELLE' and article = '69066';
update public.hardware_tariff_prices set photo = '/photos/furnitura/agb/69065-buonelle-vidpovidna-planka-do-mahnitnoho.png' where brand = 'AGB_BUONELLE' and article = '69065';
