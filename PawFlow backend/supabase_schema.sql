-- ════════════════════════════════════════════════════════════════════
-- PawFlow / Veto-Care  —  Full Supabase Schema
-- Run this once in: Supabase → SQL Editor → New Query
-- ════════════════════════════════════════════════════════════════════

-- ──────────────────────────────────────────────────────────────────
-- CLEAN SLATE — drop tables in reverse dependency order
-- This fixes any partial runs from before
-- ──────────────────────────────────────────────────────────────────
drop table if exists public.appointments cascade;
drop table if exists public.veterinarians cascade;
drop table if exists public.profiles      cascade;

drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();


-- ──────────────────────────────────────────────────────────────────
-- TABLE A  →  profiles   (extends Supabase auth.users)
-- ⚠️  DO NOT create auth.users manually — Supabase Auth handles it.
-- ──────────────────────────────────────────────────────────────────
create table public.profiles (
  id         uuid primary key references auth.users on delete cascade,
  full_name  text,
  phone      text,
  created_at timestamptz default now()
);

-- Auto-create profile row whenever a new user signs up
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- ──────────────────────────────────────────────────────────────────
-- TABLE B  →  veterinarians
-- ──────────────────────────────────────────────────────────────────
create table public.veterinarians (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  specialty  text,
  avatar_url text,
  created_at timestamptz default now()
);

-- Seed data — 4 vets so frontend can display a list immediately
insert into public.veterinarians (name, specialty) values
  ('Dr. Amira Hassan',   'General Practice'),
  ('Dr. Karim Mansour',  'Surgery'),
  ('Dr. Lina Youssef',   'Dermatology'),
  ('Dr. Omar Farouk',    'Dentistry');


-- ──────────────────────────────────────────────────────────────────
-- TABLE C  →  appointments
-- ──────────────────────────────────────────────────────────────────
create table public.appointments (
  id               uuid primary key default gen_random_uuid(),
  owner_id         uuid references auth.users(id)           not null,
  vet_id           uuid references public.veterinarians(id)  not null,
  pet_name         text                                      not null,
  pet_type         text,
  appointment_date date                                      not null,
  appointment_time time                                      not null,
  reason           text,
  status           text default 'pending'                   check (status in ('pending','confirmed','cancelled')),
  file_path        text,                     -- storage path: {owner_id}/{filename}
  created_at       timestamptz default now(),

  -- ⛔ Prevent double-booking: same vet cannot have two appointments at the same date+time
  constraint no_double_booking unique (vet_id, appointment_date, appointment_time)
);


-- ════════════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY (RLS)  — 🔥 CRITICAL — do NOT skip
-- ════════════════════════════════════════════════════════════════════

-- ── Profiles ────────────────────────────────────────────────────────
alter table public.profiles enable row level security;

create policy "User can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "User can update own profile"
  on public.profiles for update
  using (auth.uid() = id);


-- ── Veterinarians (readable by any authenticated user) ───────────────
alter table public.veterinarians enable row level security;

create policy "Authenticated users can read vets"
  on public.veterinarians for select
  using (auth.role() = 'authenticated');


-- ── Appointments (strict per-user isolation) ─────────────────────────
alter table public.appointments enable row level security;

create policy "Owner can view own appointments"
  on public.appointments for select
  using (auth.uid() = owner_id);

create policy "Owner can create own appointments"
  on public.appointments for insert
  with check (auth.uid() = owner_id);

create policy "Owner can update own appointments"
  on public.appointments for update
  using (auth.uid() = owner_id);

create policy "Owner can delete own appointments"
  on public.appointments for delete
  using (auth.uid() = owner_id);


-- ════════════════════════════════════════════════════════════════════
-- STORAGE — bucket: pet_records
-- Create the bucket manually in Supabase → Storage → New Bucket
-- Name: pet_records    |   Public: OFF (private)
-- Then run the policy below:
-- ════════════════════════════════════════════════════════════════════

-- Files stored as:  {owner_id}/{filename}
-- RLS ensures each user can only access their own folder

-- SELECT / DELETE: auth.uid() must match the first path segment
create policy "Owner can read own pet_records"
  on storage.objects for select
  using (
    bucket_id = 'pet_records'
    and auth.uid() = (storage.foldername(name))[1]::uuid
  );

-- INSERT: with check is required for write operations
create policy "Owner can upload to own pet_records"
  on storage.objects for insert
  with check (
    bucket_id = 'pet_records'
    and auth.uid() = (storage.foldername(name))[1]::uuid
  );

-- DELETE: users can remove their own files
create policy "Owner can delete own pet_records"
  on storage.objects for delete
  using (
    bucket_id = 'pet_records'
    and auth.uid() = (storage.foldername(name))[1]::uuid
  );
