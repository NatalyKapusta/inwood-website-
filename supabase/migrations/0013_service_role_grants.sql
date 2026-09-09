-- ============================================================================
-- IN WOOD — явні права для службової ролі (service_role), яку використовує
-- сайт для дій "від імені адміністратора" (запросити/заблокувати/видалити
-- користувача, змінити роль). Без цього PostgREST повертає
-- "permission denied for table ..." навіть для service_role, якщо GRANT
-- ніколи не був виконаний явно для таблиць, створених вручну через SQL Editor.
-- Виконати цілком у Supabase Dashboard → SQL Editor.
-- ============================================================================

grant usage on schema public to service_role;

grant all on public.profiles to service_role;
grant all on public.product_tariff_prices to service_role;
grant all on public.line_addon_prices to service_role;
grant all on public.service_tariff_prices to service_role;
grant all on public.price_overrides to service_role;
grant all on public.quotes to service_role;
grant all on public.site_settings to service_role;

grant usage, select on all sequences in schema public to service_role;
