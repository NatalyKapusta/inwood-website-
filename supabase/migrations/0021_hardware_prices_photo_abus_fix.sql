-- ============================================================================
-- IN WOOD -- виправлення: фото 0020 помилково записались з brand = MVM
-- для позицій циліндрів ABUS (там справжній brand = ABUS у таблиці) --
-- тому в лінії "Фурнітура ABUS" фото не зʼявлялось. Виконати цілком
-- у Supabase Dashboard SQL Editor (після 0020).
-- ============================================================================

update public.hardware_tariff_prices set photo = '/photos/furnitura/mvm/d15-n-30-40-5k.jpg' where brand = 'ABUS' and article = 'D15 N 30/40 5K';
update public.hardware_tariff_prices set photo = '/photos/furnitura/mvm/d15-n-35-35-5k.jpg' where brand = 'ABUS' and article = 'D15 N 35/35 5K';
update public.hardware_tariff_prices set photo = '/photos/furnitura/mvm/d15-n-35-45-5k.jpg' where brand = 'ABUS' and article = 'D15 N 35/45 5K';
update public.hardware_tariff_prices set photo = '/photos/furnitura/mvm/d15-n-40-40-5k.jpg' where brand = 'ABUS' and article = 'D15 N 40/40 5K';
update public.hardware_tariff_prices set photo = '/photos/furnitura/mvm/d15-n-40-50-5k.jpg' where brand = 'ABUS' and article = 'D15 N 40/50 5K';
update public.hardware_tariff_prices set photo = '/photos/furnitura/mvm/d15-n-45-45-5k.jpg' where brand = 'ABUS' and article = 'D15 N 45/45 5K';
update public.hardware_tariff_prices set photo = '/photos/furnitura/mvm/d15-n-50-50-5k.jpg' where brand = 'ABUS' and article = 'D15 N 50/50 5K';
update public.hardware_tariff_prices set photo = '/photos/furnitura/mvm/d6ps-mm-30-30-5k.jpg' where brand = 'ABUS' and article = 'D6PS MM 30/30 5K';
update public.hardware_tariff_prices set photo = '/photos/furnitura/mvm/d6ps-n-30-30-5k.jpg' where brand = 'ABUS' and article = 'D6PS N 30/30 5K';
update public.hardware_tariff_prices set photo = '/photos/furnitura/mvm/d6ps-n-30-40-5k.jpg' where brand = 'ABUS' and article = 'D6PS N 30/40 5K';
update public.hardware_tariff_prices set photo = '/photos/furnitura/mvm/d6ps-n-30-50-5k.jpg' where brand = 'ABUS' and article = 'D6PS N 30/50 5K';
update public.hardware_tariff_prices set photo = '/photos/furnitura/mvm/d6ps-n-30-60-5k.jpg' where brand = 'ABUS' and article = 'D6PS N 30/60 5K';
update public.hardware_tariff_prices set photo = '/photos/furnitura/mvm/d6ps-mm-35-35-5k.jpg' where brand = 'ABUS' and article = 'D6PS MM 35/35 5K';
update public.hardware_tariff_prices set photo = '/photos/furnitura/mvm/d6ps-n-35-35-5k.jpg' where brand = 'ABUS' and article = 'D6PS N 35/35 5K';
update public.hardware_tariff_prices set photo = '/photos/furnitura/mvm/d6ps-n-35-45-5k.jpg' where brand = 'ABUS' and article = 'D6PS N 35/45 5K';
update public.hardware_tariff_prices set photo = '/photos/furnitura/mvm/d6ps-n-35-55-5k.jpg' where brand = 'ABUS' and article = 'D6PS N 35/55 5K';
update public.hardware_tariff_prices set photo = '/photos/furnitura/mvm/d6ps-n-40-40-5k.jpg' where brand = 'ABUS' and article = 'D6PS N 40/40 5K';
update public.hardware_tariff_prices set photo = '/photos/furnitura/mvm/d6ps-n-40-50-5k.jpg' where brand = 'ABUS' and article = 'D6PS N 40/50 5K';
update public.hardware_tariff_prices set photo = '/photos/furnitura/mvm/d6ps-n-45-45-5k.jpg' where brand = 'ABUS' and article = 'D6PS N 45/45 5K';
update public.hardware_tariff_prices set photo = '/photos/furnitura/mvm/d6ps-n-50-50-5k.jpg' where brand = 'ABUS' and article = 'D6PS N 50/50 5K';
update public.hardware_tariff_prices set photo = '/photos/furnitura/mvm/d6ps-n-55-55-5k.jpg' where brand = 'ABUS' and article = 'D6PS N 55/55 5K';
update public.hardware_tariff_prices set photo = '/photos/furnitura/mvm/e50-mm-30-30.jpeg' where brand = 'ABUS' and article = 'E50 MM 30/30';
update public.hardware_tariff_prices set photo = '/photos/furnitura/mvm/e50-n-30-30.jpeg' where brand = 'ABUS' and article = 'E50 N 30/30';
update public.hardware_tariff_prices set photo = '/photos/furnitura/mvm/e50-mm-30-40.jpeg' where brand = 'ABUS' and article = 'E50 MM 30/40';
update public.hardware_tariff_prices set photo = '/photos/furnitura/mvm/e50-mm-35-35.jpeg' where brand = 'ABUS' and article = 'E50 MM 35/35';
update public.hardware_tariff_prices set photo = '/photos/furnitura/mvm/e50-n-35-35.jpeg' where brand = 'ABUS' and article = 'E50 N 35/35';
update public.hardware_tariff_prices set photo = '/photos/furnitura/mvm/e50-mm-40-40.jpeg' where brand = 'ABUS' and article = 'E50 MM 40/40';
update public.hardware_tariff_prices set photo = '/photos/furnitura/mvm/kd15-n-z30-k40-5k.jpg' where brand = 'ABUS' and article = 'KD15 N Z30/K40 5K';
update public.hardware_tariff_prices set photo = '/photos/furnitura/mvm/kd15-n-z35-k35-5k.jpg' where brand = 'ABUS' and article = 'KD15 N Z35/K35 5K';
update public.hardware_tariff_prices set photo = '/photos/furnitura/mvm/kd15-n-z35-k45-5k.jpg' where brand = 'ABUS' and article = 'KD15 N Z35/K45 5K';
update public.hardware_tariff_prices set photo = '/photos/furnitura/mvm/kd15-n-z40-k30-5k.jpg' where brand = 'ABUS' and article = 'KD15 N Z40/K30 5K';
update public.hardware_tariff_prices set photo = '/photos/furnitura/mvm/kd15-n-z40-k40-5k.jpg' where brand = 'ABUS' and article = 'KD15 N Z40/K40 5K';
update public.hardware_tariff_prices set photo = '/photos/furnitura/mvm/kd15-n-z40-k50-5k.jpg' where brand = 'ABUS' and article = 'KD15 N Z40/K50 5K';
update public.hardware_tariff_prices set photo = '/photos/furnitura/mvm/kd15-n-z45-k35-5k.jpg' where brand = 'ABUS' and article = 'KD15 N Z45/K35 5K';
update public.hardware_tariff_prices set photo = '/photos/furnitura/mvm/kd15-n-z45-k45-5k.jpg' where brand = 'ABUS' and article = 'KD15 N Z45/K45 5K';
update public.hardware_tariff_prices set photo = '/photos/furnitura/mvm/kd15-n-z50-k50-5k.jpg' where brand = 'ABUS' and article = 'KD15 N Z50/K50 5K';
update public.hardware_tariff_prices set photo = '/photos/furnitura/mvm/kd6ps-mm-z30-k30-5k.jpeg' where brand = 'ABUS' and article = 'KD6PS MM Z30/K30 5K';
update public.hardware_tariff_prices set photo = '/photos/furnitura/mvm/kd6ps-n-z30-k30-5k.jpeg' where brand = 'ABUS' and article = 'KD6PS N Z30/K30 5K';
update public.hardware_tariff_prices set photo = '/photos/furnitura/mvm/kd6ps-mm-z35-k35-5k.jpeg' where brand = 'ABUS' and article = 'KD6PS MM Z35/K35 5K';
update public.hardware_tariff_prices set photo = '/photos/furnitura/mvm/kd6ps-n-z35-k35-5k.jpeg' where brand = 'ABUS' and article = 'KD6PS N Z35/K35 5K';
update public.hardware_tariff_prices set photo = '/photos/furnitura/mvm/kd6ps-n-z40-k30-5k.jpeg' where brand = 'ABUS' and article = 'KD6PS N Z40/K30 5K';
update public.hardware_tariff_prices set photo = '/photos/furnitura/mvm/kd6ps-n-z40-k40-5k.jpeg' where brand = 'ABUS' and article = 'KD6PS N Z40/K40 5K';
update public.hardware_tariff_prices set photo = '/photos/furnitura/mvm/kd6ps-n-z45-k35-5k.jpeg' where brand = 'ABUS' and article = 'KD6PS N Z45/K35 5K';
update public.hardware_tariff_prices set photo = '/photos/furnitura/mvm/kd6ps-n-z45-k45-5k.jpeg' where brand = 'ABUS' and article = 'KD6PS N Z45/K45 5K';
update public.hardware_tariff_prices set photo = '/photos/furnitura/mvm/kd6ps-n-z50-k40-5k.jpeg' where brand = 'ABUS' and article = 'KD6PS N Z50/K40 5K';
update public.hardware_tariff_prices set photo = '/photos/furnitura/mvm/kd6ps-n-z50-k50-5k.jpeg' where brand = 'ABUS' and article = 'KD6PS N Z50/K50 5K';
update public.hardware_tariff_prices set photo = '/photos/furnitura/mvm/kd6ps-n-z55-k35-5k.jpeg' where brand = 'ABUS' and article = 'KD6PS N Z55/K35 5K';
update public.hardware_tariff_prices set photo = '/photos/furnitura/mvm/kd6ps-n-z60-k30-5k.jpeg' where brand = 'ABUS' and article = 'KD6PS N Z60/K30 5K';
update public.hardware_tariff_prices set photo = '/photos/furnitura/mvm/ke50-mm-z30-k30.jpeg' where brand = 'ABUS' and article = 'KE50 MM Z30/K30';
update public.hardware_tariff_prices set photo = '/photos/furnitura/mvm/ke50-n-z30-k30.jpeg' where brand = 'ABUS' and article = 'KE50 N Z30/K30';
update public.hardware_tariff_prices set photo = '/photos/furnitura/mvm/ke50-mm-z35-k35.jpeg' where brand = 'ABUS' and article = 'KE50 MM Z35/K35';
update public.hardware_tariff_prices set photo = '/photos/furnitura/mvm/ke50-n-z35-k35.jpeg' where brand = 'ABUS' and article = 'KE50 N Z35/K35';
update public.hardware_tariff_prices set photo = '/photos/furnitura/mvm/ke50-mm-z40-k40.jpeg' where brand = 'ABUS' and article = 'KE50 MM Z40/K40';
