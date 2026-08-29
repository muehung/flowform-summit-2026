# FlowForm

FlowForm 是一個使用 JavaScript、Vue 3 製作的多步驟活動報名表單練習專案。

本專案透過表單驗證、資料處理、非同步帳號檢查及 API 串接等功能，模擬使用者從填寫基本資料、設定帳號到完成報名的流程。

## 畫面設計與切版

畫面設計與初始切版主要由 Stitch 產生，再依照專案需求微調版面、改寫為 Vue 模板，並將共用內容拆分為元件。

## 專案架構

```text
src/
├── components/    # 共用元件
├── router/        # Vue Router 路由設定
├── stores/        # Pinia 狀態管理
├── views/         # Step01～Step04、成功頁及錯誤頁
├── App.vue
└── main.js

backend/
└── server.js      # Express API
```

## 開發進度

* [x] Step01 基本資料表單
* [x] Step02 身分與興趣表單
* [x] Step03 帳號與密碼表單
* [x] Step04 報名資料確認頁
* [x] 報名成功頁
* [ ] 報名錯誤頁
* [ ] 完成報名 API
* [ ] 加入路由守衛
* [ ] 完成專案測試
* [ ] 部署專案

## 專案目的

這是一個用於程式學習與求職作品展示的練習專案，並非實際營運中的活動報名服務。

透過本專案練習以下內容：

* JavaScript 表單資料處理
* JavaScript 非同步流程與 API 串接
* JavaScript 陣列、物件及條件判斷
* 表單驗證與錯誤狀態處理
* Vue 3 Composition API
* VeeValidate 表單驗證
* Pinia 跨頁資料管理
* Vue Router 多步驟流程
* Git 版本控制

## 作者

Cheyl