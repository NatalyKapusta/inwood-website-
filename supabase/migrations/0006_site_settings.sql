-- ============================================================================
-- IN WOOD — глобальні налаштування сайту (перемикач видимості цін тощо)
-- Виконати після 0005_model_variant_prices_seed.sql
-- ============================================================================

create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now(),
  updated_by uuid references public.profiles (id)
);

comment on table public.site_settings is
  'Глобальні перемикачі сайту (напр. "prices_visible") — читає будь-хто '
  '(потрібно публічному каталогу), змінює лише staff.';

alter table public.site_settings enable row level security;

drop policy if exists "site_settings_select_all" on public.site_settings;
create policy "site_settings_select_all"
  on public.site_settings for select
  using (true);

drop policy if exists "site_settings_write_staff" on public.site_settings;
create policy "site_settings_write_staff"
  on public.site_settings for all
  using (public.current_user_role() = 'staff')
  with check (public.current_user_role() = 'staff');

insert into public.site_settings (key, value)
values ('prices_visible', 'true'::jsonb)
on conflict (key) do nothing;
