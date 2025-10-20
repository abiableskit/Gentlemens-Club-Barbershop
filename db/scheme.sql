-- Run this in Supabase SQL editor

-- 1. profiles table (metadata for auth.users)
create table if not exists profiles (
  id uuid references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  role text default 'user', -- 'admin' for admin users
  created_at timestamptz default now(),
  primary key (id)
);

-- 2. bookings
create table if not exists bookings (
  id uuid default gen_random_uuid() primary key,
  user_name text not null,
  email text,
  phone text,
  service text not null,
  preferred_date timestamptz,
  notes text,
  status text default 'pending', -- pending, confirmed, cancelled, rescheduled
  created_at timestamptz default now()
);

-- 3. inquiries
create table if not exists inquiries (
  id uuid default gen_random_uuid() primary key,
  name text,
  email text,
  phone text,
  message text,
  created_at timestamptz default now()
);

-- 4. visits
create table if not exists visits (
  id uuid default gen_random_uuid() primary key,
  session_id text,
  ip text,
  path text,
  user_agent text,
  created_at timestamptz default now()
);

-- Indexes
create index if not exists idx_visits_created_at on visits(created_at);
create index if not exists idx_bookings_created_at on bookings(created_at);
create index if not exists idx_inquiries_created_at on inquiries(created_at);
