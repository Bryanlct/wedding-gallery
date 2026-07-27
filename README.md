# 婚宴即時互動相簿

行動端優先的婚宴即時相簿平台，賓客可即時上傳照片、瀏覽相簿牆，並下載高畫質原圖。

## 功能特色

- **相簿牆 (Feed)**：雙欄瀑布流，支援搜尋、篩選（Latest / Top / Today），Supabase Real-time 即時更新
- **多圖上傳**：原生多選、縮圖預覽、自動壓縮、批次上傳進度顯示
- **下載專區**：三欄網格、點擊大圖檢視、一鍵下載高畫質原圖
- **深紫色主題**：Mobile-first 設計，電腦上呈現手機外框精緻感

## 技術堆疊

- Next.js 15 (App Router)
- Tailwind CSS 4
- Supabase (PostgreSQL + Storage + Realtime)
- Lucide React

## 快速開始

### 1. 安裝 Node.js 與依賴

```bash
cd c:\Users\bryanlai\Documents\wedding
npm install
```

### 2. 建立 Supabase 專案

1. 前往 [supabase.com](https://supabase.com) 建立免費專案
2. 在 **SQL Editor** 中執行 `supabase/schema.sql` 的全部內容
3. 到 **Project Settings > API** 複製：
   - Project URL
   - `anon` public key

### 3. 設定環境變數

```bash
copy .env.local.example .env.local
```

編輯 `.env.local`：

```env
NEXT_PUBLIC_SUPABASE_URL=https://你的專案ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的anon-key
```

### 4. 啟動開發伺服器

```bash
npm run dev
```

開啟 [http://localhost:3000](http://localhost:3000)

## 專案結構

```
wedding/
├── app/
│   ├── layout.js              # 根 Layout（手機外框 + 底部導覽）
│   ├── page.js                # 相簿牆首頁
│   ├── upload/page.js         # 多圖上傳頁
│   ├── download/page.js       # 下載專區
│   └── globals.css            # 全域樣式與色彩主題
├── components/
│   ├── BottomNav.jsx          # 底部導覽列
│   ├── PhotoFeed.jsx          # 相簿牆（含 Real-time）
│   ├── PhotoGallery.jsx       # 下載專區網格
│   ├── PhotoLightbox.jsx      # 全螢幕照片檢視
│   ├── UploadForm.jsx         # 多圖上傳表單
│   ├── LoadingSpinner.jsx
│   └── EmptyState.jsx
├── hooks/
│   └── usePhotos.js           # 照片資料 + Real-time 訂閱
├── utils/
│   ├── supabase.js            # Supabase 客戶端
│   ├── compressImage.js       # 前端圖片壓縮
│   ├── uploadPhoto.js         # 上傳邏輯
│   ├── downloadImage.js       # 下載邏輯
│   └── formatTime.js          # 相對時間格式化
├── supabase/
│   └── schema.sql             # 資料庫與 Storage 初始化腳本
└── plan.md
```

## 部署至 Vercel

### 方法一：GitHub 連動（推薦）

```bash
git init
git add .
git commit -m "Initial commit: wedding gallery app"
```

1. 將專案推送到 GitHub
2. 前往 [vercel.com](https://vercel.com) > **Add New Project**
3. 匯入 GitHub repo
4. 在 **Environment Variables** 加入：
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. 點擊 **Deploy**

### 方法二：Vercel CLI

```bash
npm i -g vercel
vercel
```

依提示設定環境變數即可。

## Supabase 注意事項

- Storage Bucket `wedding-photos` 必須設為**公開 (public)**
- 確認 `photos` 資料表已加入 Realtime publication（`schema.sql` 已包含）
- 免費方案 Storage 上限 1GB，圖片壓縮可延長使用壽命

## 授權

MIT
