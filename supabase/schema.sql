create extension if not exists pgcrypto;

create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  code text not null,
  instructor text not null,
  color text not null default 'violet',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.assignments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  title text not null,
  due_date date not null,
  status text not null default 'pending',
  priority text not null default 'Medium',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.study_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  title text not null,
  session_date timestamptz not null,
  duration_minutes integer not null,
  format text not null default 'Deep work',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.courses enable row level security;
alter table public.assignments enable row level security;
alter table public.study_sessions enable row level security;

create policy "users_manage_own_courses"
on public.courses
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "users_manage_own_assignments"
on public.assignments
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "users_manage_own_sessions"
on public.study_sessions
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
