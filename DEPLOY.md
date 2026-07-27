# Vercel 部署指南 — Agnes & Bryan 婚宴相簿

## 方法一：Vercel 網頁介面（推薦）

### 1. 推送程式碼到 GitHub

在 [github.com](https://github.com) 建立新 repository（例如 `wedding-gallery`），然後執行：

```bash
cd c:\Users\bryanlai\Documents\wedding
git remote add origin https://github.com/你的帳號/wedding-gallery.git
git branch -M main
git push -u origin main
```

### 2. 在 Vercel 匯入專案

1. 前往 [vercel.com](https://vercel.com) 並用 GitHub 登入
2. 點 **Add New → Project**
3. 選擇 `wedding-gallery` repository
4. Framework 會自動偵測為 **Next.js**

### 3. 設定環境變數（重要！）

展開 **Environment Variables**，加入：

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://qjbpsckgufcwnpiatlco.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | 從 Supabase Dashboard 複製的 anon key |

### 4. 點 Deploy

完成後會得到網址，例如：`https://wedding-gallery-xxx.vercel.app`

---

## 方法二：Vercel CLI

```bash
npm i -g vercel
vercel login
cd c:\Users\bryanlai\Documents\wedding
vercel
vercel --prod
```

---

## 部署後檢查

- 首頁能載入照片
- 上傳功能正常
- 下載功能正常
- 手機瀏覽器顯示正常
