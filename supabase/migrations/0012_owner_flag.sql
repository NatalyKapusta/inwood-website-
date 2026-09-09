-- ============================================================================
-- IN WOOD — доступ до "Користувачі" лише у власника (не у всіх staff)
-- Виконати у Supabase Dashboard → SQL Editor.
-- ============================================================================

alter table public.profiles add column if not exists is_owner boolean not null default false;

comment on column public.profiles.is_owner is
  'true — лише ця людина бачить і керує сторінкою "Користувачі" порталу '
  '(запрошення, ролі, блокування, видалення). Роль staff сама по собі '
  'доступу до керування користувачами більше не дає.';

update public.profiles set is_owner = true where email = 'hodes.nv@gmail.com';
