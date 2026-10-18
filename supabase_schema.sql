-- ==============================================================================
-- KLASSENTREFFEN SUPABASE SETUP SCRIPT
-- Kopiere diesen Code einfach in den Supabase SQL Editor und klicke auf "Run"!
-- ==============================================================================

-- 1. Tabelle für Abstimmungen erstellen
create table if not exists public.votes (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  avatar text not null default '😎',
  selected_slots text[] not null default '{}',
  selected_locations text[] not null default '{}',
  custom_location text default '',
  message text default ''
);

-- 2. Row Level Security aktivieren (damit jeder ohne Login abstimmen kann)
alter table public.votes enable row level security;

-- Bestehende Policies löschen (falls erneut ausgeführt)
drop policy if exists "Allow public read access" on public.votes;
drop policy if exists "Allow public insert access" on public.votes;
drop policy if exists "Allow public update access" on public.votes;

-- Jeder darf alle Stimmen ansehen (Ergebnisseite)
create policy "Allow public read access"
  on public.votes for select
  using (true);

-- Jeder darf abstimmen (ohne Login)
create policy "Allow public insert access"
  on public.votes for insert
  with check (true);

-- Jeder darf seinen Eintrag updaten
create policy "Allow public update access"
  on public.votes for update
  using (true);

-- 3. Supabase Realtime für Live-Updates aktivieren
alter publication supabase_realtime add table public.votes;
