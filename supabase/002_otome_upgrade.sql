-- 乙女大作版資料擴充。先在 .env.local 設定 SUPABASE_SERVICE_ROLE_KEY，
-- 再於 Supabase SQL Editor 執行本檔。

alter table public.guest_progress
  add column if not exists session_token_hash text,
  add column if not exists affection_score integer not null default 0,
  add column if not exists hints_used integer not null default 0,
  add column if not exists attempts integer not null default 0,
  add column if not exists achievements jsonb not null default '[]'::jsonb,
  add column if not exists ending_type text,
  add column if not exists playthrough_count integer not null default 0;

create unique index if not exists guest_progress_session_token_hash_key
  on public.guest_progress (session_token_hash)
  where session_token_hash is not null;

alter table public.guest_progress
  drop constraint if exists guest_progress_affection_score_check;
alter table public.guest_progress
  add constraint guest_progress_affection_score_check
  check (affection_score between 0 and 100);

alter table public.guest_progress
  drop constraint if exists guest_progress_ending_type_check;
alter table public.guest_progress
  add constraint guest_progress_ending_type_check
  check (ending_type is null or ending_type in ('eternal', 'starlight', 'promise'));

drop policy if exists "Allow public insert progress" on public.guest_progress;
drop policy if exists "Allow public select progress" on public.guest_progress;
drop policy if exists "Allow public update progress" on public.guest_progress;

revoke all on public.guest_progress from anon;

-- 所有賓客資料操作改由 Next.js Route Handler 使用 service_role 執行。
-- service_role 會繞過 RLS，絕對不可放入 NEXT_PUBLIC_ 開頭的環境變數。
