-- ============================================================================
-- IN WOOD — можливість заблокувати доступ користувача до порталу
-- Виконати у Supabase Dashboard → SQL Editor.
-- ============================================================================

alter table public.profiles add column if not exists blocked boolean not null default false;

comment on column public.profiles.blocked is
  'true — доступ до порталу заблоковано співробітником IN WOOD (staff). '
  'Синхронізується з ban_duration користувача в auth.users через адмін-дію.';
