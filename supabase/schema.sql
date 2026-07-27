-- =============================================
-- 婚宴即時相簿 Supabase 初始化腳本
-- 在 Supabase Dashboard > SQL Editor 中執行
-- =============================================

-- 1. 建立 photos 資料表
create table if not exists public.photos (
  id uuid default gen_random_uuid() primary key,
  image_url text not null,
  user_name text,
  message text,
  created_at timestamptz default now() not null
);

-- 2. 建立索引（加速排序查詢）
create index if not exists photos_created_at_idx
  on public.photos (created_at desc);

-- 3. 啟用 Row Level Security
alter table public.photos enable row level security;

-- 4. RLS 政策：所有人可讀取
create policy "Allow public read access"
  on public.photos for select
  using (true);

-- 5. RLS 政策：所有人可新增（賓客上傳）
create policy "Allow public insert"
  on public.photos for insert
  with check (true);

-- 6. 啟用 Realtime（讓相簿即時更新）
alter publication supabase_realtime add table public.photos;

-- =============================================
-- Storage Bucket 設定（需在 Dashboard 手動建立，或使用以下 SQL）
-- =============================================

-- 建立公開 Storage Bucket
insert into storage.buckets (id, name, public)
values ('wedding-photos', 'wedding-photos', true)
on conflict (id) do nothing;

-- Storage 政策：所有人可讀取
create policy "Allow public read on wedding-photos"
  on storage.objects for select
  using (bucket_id = 'wedding-photos');

-- Storage 政策：所有人可上傳
create policy "Allow public upload on wedding-photos"
  on storage.objects for insert
  with check (bucket_id = 'wedding-photos');
