-- ============================================================================
-- IN WOOD — приватний список співробітників власниці (/portal/staff-notes):
-- ім'я, посада, email (логін у кабінеті), пароль, телефон, коментар. Бачить
-- і редагує лише власниця (is_owner) — та сама модель доступу, що й
-- dealer_notes у 0027 (is_portal_owner() звідти вже створена, тут не
-- дублюємо).
-- Виконати цілком у Supabase Dashboard → SQL Editor.
-- ============================================================================

create table if not exists public.staff_notes (
  id uuid primary key default gen_random_uuid(),
  full_name text not null default '',
  position text not null default '',
  email text not null default '',
  password text not null default '',
  phone text not null default '',
  comment text not null default '',
  sort_order integer not null default 0,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

comment on table public.staff_notes is
  'Приватний список співробітників власниці (/portal/staff-notes) — ім''я, '
  'посада, email (логін у кабінеті), пароль, телефон, коментар. Бачить і '
  'редагує лише is_owner.';

alter table public.staff_notes enable row level security;

drop policy if exists "staff_notes_owner_only" on public.staff_notes;
create policy "staff_notes_owner_only"
  on public.staff_notes for all
  using (public.is_portal_owner())
  with check (public.is_portal_owner());

grant select, insert, update, delete on public.staff_notes to authenticated;
