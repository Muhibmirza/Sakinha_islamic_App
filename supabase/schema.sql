-- Run once in the Supabase SQL editor. Every user-owned table is protected by RLS.
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null default '', email text, city text,
  preferences jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.bookmarks (
  id bigint generated always as identity primary key, user_id uuid not null references auth.users(id) on delete cascade,
  kind text not null check (kind in ('ayah','hadith','book')), reference text not null, payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(), unique(user_id,kind,reference)
);
create table if not exists public.tasbeeh_sessions (
  id bigint generated always as identity primary key, user_id uuid not null references auth.users(id) on delete cascade,
  dhikr text not null, count integer not null check(count > 0), created_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
alter table public.bookmarks enable row level security;
alter table public.tasbeeh_sessions enable row level security;
create policy "profiles own rows" on public.profiles for all using (auth.uid()=id) with check (auth.uid()=id);
create policy "bookmarks own rows" on public.bookmarks for all using (auth.uid()=user_id) with check (auth.uid()=user_id);
create policy "tasbeeh own rows" on public.tasbeeh_sessions for all using (auth.uid()=user_id) with check (auth.uid()=user_id);
create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path=public as $$
begin insert into public.profiles(id,name,email) values(new.id,coalesce(new.raw_user_meta_data->>'name',''),new.email) on conflict do nothing; return new; end; $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();

