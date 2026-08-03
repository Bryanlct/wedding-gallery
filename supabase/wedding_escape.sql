-- 在 Supabase SQL Editor 執行一次。
create table if not exists public.guest_progress (
  id uuid default gen_random_uuid() primary key,
  guest_name text not null,
  phone_number text not null unique,
  current_level integer not null default 1 check (current_level between 1 and 5),
  is_completed boolean not null default false,
  completion_code text unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  completed_at timestamp with time zone
);

alter table public.guest_progress
  add column if not exists completed_at timestamp with time zone;

create unique index if not exists guest_progress_phone_number_key
  on public.guest_progress (phone_number);

alter table public.guest_progress enable row level security;

drop policy if exists "Allow public insert progress" on public.guest_progress;
drop policy if exists "Allow public select progress" on public.guest_progress;
drop policy if exists "Allow public update progress" on public.guest_progress;

create policy "Allow public insert progress"
  on public.guest_progress
  for insert
  to anon
  with check (
    current_level = 1
    and is_completed = false
    and completion_code is null
  );

create policy "Allow public select progress"
  on public.guest_progress
  for select
  to anon
  using (true);

create policy "Allow public update progress"
  on public.guest_progress
  for update
  to anon
  using (true)
  with check (current_level between 1 and 5);

grant select, insert, update on public.guest_progress to anon;

-- 注意：以上政策適合低風險婚宴遊戲 MVP，但匿名使用者仍可繞過前端讀寫資料。
-- 正式公開 QR Code 前，建議將查詢與過關更新移至 Next.js Route Handler，
-- 使用伺服器端驗證答案，並把匿名 select/update 政策收緊。
