create table if not exists public.feedings (
  id uuid primary key,
  feeding_at timestamp without time zone not null unique,
  ml integer not null check (ml > 0 and ml <= 1000),
  note text not null default '' check (char_length(note) <= 500),
  created_at timestamptz not null default now()
);

alter table public.feedings enable row level security;
create policy "public read feedings" on public.feedings for select using (true);
create policy "public insert feedings" on public.feedings for insert with check (true);
create policy "public update feedings" on public.feedings for update using (true) with check (true);
create policy "public delete feedings" on public.feedings for delete using (true);
alter publication supabase_realtime add table public.feedings;
