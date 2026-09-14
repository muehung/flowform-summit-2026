# FlowForm

FlowForm 是一個使用 JavaScript、Vue 3 製作的多步驟活動報名表單練習專案。

本專案透過表單驗證、資料處理、非同步帳號檢查及 API 串接等功能，模擬使用者從填寫基本資料、設定帳號到完成報名的流程。

> 本專案是用於程式學習與專案實作的低流量 Demo，並非實際營運中的活動報名服務。

## 主要功能

- Step01～Step04 多步驟報名表單
- 表單欄位驗證與錯誤訊息顯示
- 使用 Pinia 保存跨頁表單資料
- 非同步檢查帳號是否可用
- 確認資料後建立報名紀錄
- 送出失敗時留在確認頁並顯示錯誤訊息
- 報名成功頁顯示報名資料
- 後端登入、登入狀態查詢及登出 API

## 使用技術

### 前端

- JavaScript
- Vue 3 Composition API
- Vite
- Vue Router
- Pinia
- VeeValidate
- Tailwind CSS

### 後端與部署

- Node.js、Express、SQLite（本機開發）
- Cloudflare Worker、D1（線上環境）
- Fetch API
- Cookie Session
- PBKDF2-HMAC-SHA-256 密碼雜湊

## 畫面設計與切版

畫面設計與初始切版主要由 Stitch 產生，再依照專案需求微調版面、改寫為 Vue 模板，並將共用內容拆分為元件。

## 專案架構

```text
FlowForm/
├── frontend/
│   ├── src/
│   │   ├── components/    # 共用元件
│   │   ├── router/        # Vue Router 路由設定
│   │   ├── stores/        # Pinia 狀態管理
│   │   └── views/         # Step01～Step04 與報名成功頁
│   └── public/
│
└── backend/
    ├── shared/            # 共用驗證與業務邏輯
    ├── express/           # 本機 Express 與 SQLite
    ├── pagesfunction/     # Cloudflare Worker 與 D1
    └── docs/              # API 文件
```

## 本機開發

需求：Node.js 22.12 以上及 pnpm。

### 啟動後端

```bash
cd backend
pnpm install
pnpm start
```

後端會啟動於 `http://localhost:3000`。

### 啟動前端

開啟另一個 Terminal：

```bash
cd frontend
pnpm install
pnpm dev
```

## 開發進度

- [x] Step01 基本資料表單
- [x] Step02 身分與興趣表單
- [x] Step03 帳號與密碼表單
- [x] Step04 報名資料確認頁
- [x] 報名成功頁
- [x] 帳號檢查與報名 API
- [x] 送出失敗時留在 Step04 顯示錯誤訊息
- [x] 後端登入、登入狀態查詢及登出 API
- [x] Cloudflare Worker 與 D1 部署
- [ ] 登入與後台前端畫面
- [ ] Router Guard
- [ ] 完成專案測試

## 專案目的

透過本專案練習以下內容：

- JavaScript 表單資料處理
- JavaScript 非同步流程與 API 串接
- JavaScript 陣列、物件及條件判斷
- 表單驗證與錯誤狀態處理
- Vue 3 Composition API
- Pinia 跨頁資料管理
- Vue Router 多步驟流程
- 前後端資料串接
- 使用 Codex 協助程式碼檢查、除錯與重構
- Git 版本控制
