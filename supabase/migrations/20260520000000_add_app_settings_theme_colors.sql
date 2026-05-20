alter table public.app_settings
  add column if not exists primary_color text,
  add column if not exists secondary_color text;

update public.app_settings
set primary_color = '#1a2744'
where primary_color is null
  or primary_color !~ '^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$';

update public.app_settings
set secondary_color = '#f1f3f7'
where secondary_color is null
  or secondary_color !~ '^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$';

alter table public.app_settings
  alter column primary_color set default '#1a2744',
  alter column primary_color set not null,
  alter column secondary_color set default '#f1f3f7',
  alter column secondary_color set not null;

alter table public.app_settings
  drop constraint if exists app_settings_primary_color_hex_check,
  add constraint app_settings_primary_color_hex_check
    check (primary_color ~ '^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$'),
  drop constraint if exists app_settings_secondary_color_hex_check,
  add constraint app_settings_secondary_color_hex_check
    check (secondary_color ~ '^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$');
