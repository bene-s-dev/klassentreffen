-- ==============================================================================
-- KLASSENTREFFEN 2.0 - SUPABASE SETUP SCRIPT
-- Füge dieses Skript einfach im Supabase Dashboard unter "SQL Editor" ein
-- und klicke auf "Run"! Es erstellt eine eigene, konfliktfreie Tabelle.
-- ==============================================================================

-- 1. Eigene Tabelle für das Klassentreffen erstellen
create table if not exists public.klassentreffen_votes (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  avatar text not null default '😎',
  selected_slots text[] not null default '{}',
  selected_locations text[] not null default '{}',
  custom_location text default '',
  message text default ''
);

-- 2. Row Level Security (RLS) aktivieren
alter table public.klassentreffen_votes enable row level security;

-- Bestehende Policies sauber bereinigen
drop policy if exists "Allow public read access" on public.klassentreffen_votes;
drop policy if exists "Allow public insert access" on public.klassentreffen_votes;
drop policy if exists "Allow public update access" on public.klassentreffen_votes;

-- Jeder darf alle Stimmen live einsehen (Doodle-Ergebnisübersicht)
create policy "Allow public read access"
  on public.klassentreffen_votes for select
  using (true);

-- Jeder darf ohne Login abstimmen
create policy "Allow public insert access"
  on public.klassentreffen_votes for insert
  with check (true);

-- Aktualisierung erlauben
create policy "Allow public update access"
  on public.klassentreffen_votes for update
  using (true);

-- 3. Supabase Realtime aktivieren (für Live-Updates im Browser)
alter publication supabase_realtime add table public.klassentreffen_votes;
