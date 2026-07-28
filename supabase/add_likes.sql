-- =============================================
-- 讚好功能遷移腳本（現有專案執行此檔即可）
-- 在 Supabase Dashboard > SQL Editor 中執行
-- =============================================

-- 1. 新增 likes_count 欄位
alter table public.photos
  add column if not exists likes_count integer default 0 not null;

-- 2. 加速 Top 排序查詢
create index if not exists photos_likes_count_idx
  on public.photos (likes_count desc);

-- 3. 允許賓客更新讚好數
create policy "Allow public update likes"
  on public.photos for update
  using (true)
  with check (true);
