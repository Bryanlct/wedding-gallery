# 婚宴即時互動相簿專案計畫 (Wedding Real-time Gallery)

## 1. 專案概述
- **目標**：建立一個行動端優先 (Mobile-First)、以紫色系為主調的婚宴即時相互動與下載平台。
- **生命週期**：約 3 個月（婚前準備、當日即時互動、婚後下載期）。
- **預算**：零成本架構 (Vercel + Supabase 免費方案)。

## 2. 技術堆疊 (Tech Stack)
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS 4 + Lucide React (Icons)
- **Database & Storage**: Supabase (PostgreSQL + Storage Bucket)
- **Deployment**: Vercel

## 3. 資料庫設計 (Supabase Database Schema)
建立一個 `photos` 資料表：
- `id` (UUID, Primary Key)
- `image_url` (Text, 存放 Supabase Storage 的公開網址)
- `user_name` (Text, 賓客姓名，選填)
- `message` (Text, 祝福留言，選填)
- `created_at` (Timestamp, 預設 `now()`)

## 4. 頁面與核心功能架構 (Mobile-First UI)
- **底部導覽列 (Bottom Navigation)**：固定在底部，切換三個主要視圖：
  1. **相簿牆 (`/`)**：瀑布流顯示所有上傳照片，支援 Supabase Real-time 即時更新。
  2. **上傳頁面 (`/upload`)**：支援多圖選取 (`multiple`)、縮圖預覽、批次留言與上傳進度條。
  3. **下載專區 (`/download`)**：網格化呈現原圖，支援點擊檢視與一鍵下載。

## 5. 開發步驟 (Execution Phases for Cursor)
- [x] **Phase 1: 專案初始化與樣式設定**
  - 初始化 Next.js 專案並配置 Tailwind CSS。
  - 設定深紫色主題色系 (Tailwind config)。
- [x] **Phase 2: Supabase 串接**
  - 建立 Supabase Client (`utils/supabase.js`)。
  - 建立 Storage Bucket (`wedding-photos`) 與資料表 (`supabase/schema.sql`)。
- [x] **Phase 3: UI 切版與響應式設計**
  - 製作底部導覽列 Layout (`components/BottomNav.jsx`)。
  - 實作相簿牆檢視介面 (`components/PhotoFeed.jsx`)。
  - 實作多圖上傳介面 (含預覽) (`components/UploadForm.jsx`)。
- [x] **Phase 4: 核心邏輯串接**
  - 實作前端圖片壓縮 (`utils/compressImage.js`) 與批次上傳 (`utils/uploadPhoto.js`)。
  - 寫入 `photos` 資料表。
  - 實作 Real-time 訂閱 (`hooks/usePhotos.js`)，讓相簿自動更新。
- [ ] **Phase 5: 打包與部署**
  - 部署至 Vercel，完成環境變數設定。
