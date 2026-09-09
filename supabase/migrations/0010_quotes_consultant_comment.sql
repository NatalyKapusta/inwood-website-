-- ============================================================================
-- IN WOOD — телефон консультанта та коментар у збережених КП (як у клієнта).
-- Виконати цілком у Supabase Dashboard → SQL Editor.
-- ============================================================================

alter table public.quotes add column if not exists consultant_contact text;
alter table public.quotes add column if not exists comment text;
