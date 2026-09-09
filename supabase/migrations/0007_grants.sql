-- ============================================================================
-- IN WOOD — базові права доступу (GRANT) для ролей anon/authenticated.
-- Без цього Postgres блокує запити до таблиць з написом
-- "permission denied for table ..." ще до того, як спрацюють RLS-політики —
-- RLS вирішує, ЯКІ рядки видно, а GRANT вирішує, чи можна взагалі
-- звертатись до таблиці. Виконати цілком у Supabase Dashboard → SQL Editor.
-- ============================================================================

grant usage on schema public to anon, authenticated;

-- Таблиці закритого порталу — читання/запис для будь-якого залогіненого
-- користувача, фактичну видимість рядків і дозволені операції все одно
-- визначають RLS-політики з попередніх міграцій.
grant select on public.profiles to authenticated;
grant select, insert, update on public.product_tariff_prices to authenticated;
grant select, insert, update on public.line_addon_prices to authenticated;
grant select, insert, update on public.service_tariff_prices to authenticated;
grant select, insert, update on public.price_overrides to authenticated;
grant select, insert on public.quotes to authenticated;

-- Ідентифікатори (bigint generated always as identity) потребують окремого
-- права на послідовність, інакше insert falls через "permission denied for sequence".
grant usage, select on all sequences in schema public to authenticated;

-- site_settings ("prices_visible") читає публічний каталог для
-- незалогінених відвідувачів — тому select ще й для anon.
grant select on public.site_settings to anon, authenticated;
grant insert, update on public.site_settings to authenticated;
