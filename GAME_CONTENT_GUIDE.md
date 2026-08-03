# 婚宴乙女遊戲內容替換指南

## 新人資料與文字

- 新人姓名、日期、場地：`lib/escapeGame.js`
- 序章、四章台詞、公開線索、提示、成就與結局：`lib/gameContent.js`
- 正確答案（僅伺服器載入）：`lib/gameServerConfig.js`

修改答案時，請同步確認公開線索仍能合理推導答案，但不要把答案重新放進關卡元件。

## 圖片

圖片均位於 `public/game/`：

- `title.png`：標題畫面及登入背景
- `central-night.png`：第一章尖沙咀海旁場景（檔名沿用）
- `garden-hidden.png`：第三章尋物場景
- `ending.png`：通關結局 CG

替換時保留檔名即可。建議使用 9:16 直向圖片，寬度至少 1080px。第三章若更換圖片，需在
`lib/gameContent.js` 的 `objects` 更新每件物品中心點 `x`、`y` 百分比與點擊範圍 `size`。

## 音效

目前音效由 `contexts/GameAudioContext.jsx` 的 Web Audio 即時產生，不依賴外部音樂授權。
可調整 `frequencies`、環境音音量及波形。若日後加入 MP3，必須保留首次點擊後才播放的限制。

## 正式上線前的資料庫步驟

1. 在 Supabase Dashboard 的 Project Settings > API 取得 `service_role` secret。
2. 將它放入部署平台及本機 `.env.local`：

   `SUPABASE_SERVICE_ROLE_KEY=你的service-role-key`

3. 切勿使用 `NEXT_PUBLIC_` 前綴，也不要提交真實 secret。
4. 在 Supabase SQL Editor 執行 `supabase/002_otome_upgrade.sql`。
5. 重新啟動 Next.js。

新版 migration 會保留既有玩家與通關碼，但會關閉瀏覽器匿名讀寫整張賓客資料表的權限。
