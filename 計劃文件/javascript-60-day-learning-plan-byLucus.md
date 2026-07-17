# JavaScript 60 天學習計畫

對象：前端新人，目前具備 UI/UX design、網站切版、CSS 能力，但 JavaScript 基礎較弱。  
目標：60 天內具備閱讀既有前端專案 `intranet` 與 `digicare` JavaScript 的能力，能追流程、看懂互動邏輯，並能在 code review 協助下完成低風險小修改。

## 學習總目標

- 看懂 `intranet`、`digicare` 中常見的 JavaScript 寫法。
- 能追蹤按鈕、表單、彈窗、列表、API 呼叫的流程。
- 能理解基本資料處理：array、object、map、filter、find、條件判斷。
- 能看懂非同步邏輯：AJAX、fetch、Promise、async/await。
- 能使用 DevTools 做基本 debug。
- 能在前輩協助下修改簡單功能，例如欄位顯示、表單驗證、互動行為。

## 建議每日節奏

- 學習：45-60 分鐘
- 練習：30-45 分鐘
- 專案閱讀 / 筆記：20-30 分鐘
- 每週保留 1 天做整理、回顧、code review 或小任務

## 60 天學習表

| Day | 學習大綱 | 學習目標 | 建議節奏 | 內容與練習 | 小任務 | 評估方式 |
|---|---|---|---|---|---|---|
| 1 | 認識 JavaScript | 知道 JS 在前端專案中負責什麼 | 學概念 + 看頁面互動 | 了解 HTML、CSS、JS 分工；觀察專案中按鈕、表單、彈窗互動 | 找出專案中 3 個 JS 控制的畫面互動 | 能說出 JS 和 CSS 的差別 |
| 2 | 變數與基本型別 | 看懂 `let`、`const`、string、number、boolean | 語法 + 小練習 | 宣告變數、顯示文字、數字計算、true/false 判斷 | 寫一段使用者名稱與狀態顯示邏輯 | 能解釋變數用途 |
| 3 | 條件判斷 | 看懂 `if / else` | 語法 + UI 情境 | 狀態判斷、欄位是否顯示、錯誤訊息判斷 | 根據登入狀態顯示不同文字 | 能讀懂簡單條件流程 |
| 4 | 比較與邏輯運算 | 看懂 `===`、`!==`、`&&`、`||` | 語法 + 表單情境 | 多條件判斷，例如欄位不可空、狀態為啟用 | 寫簡單表單驗證條件 | 能說出條件成立 / 不成立原因 |
| 5 | 函式基礎 | 看懂 function 是什麼 | 語法 + 重複邏輯整理 | `function`、參數、return | 寫一個格式化姓名或狀態文字的 function | 能說明 input / output |
| 6 | Arrow Function | 看懂 `() => {}` | 專案常見語法閱讀 | 傳統 function 與 arrow function 差異 | 將 3 個 function 改寫成 arrow function | 能辨識專案中的 arrow function |
| 7 | 第 1 週回顧 | 整理 JS 基礎語法 | 回顧 + 筆記 | 整理變數、條件、函式筆記 | 做一頁「JS 基礎速查表」 | 能回答本週 5 個基礎問題 |
| 8 | DOM 是什麼 | 知道 JS 如何操作畫面 | 概念 + 實作 | `document`、HTML element、DOM tree | 用 JS 選到一個按鈕與文字區塊 | 能解釋 DOM 和 HTML 的關係 |
| 9 | DOM 選取 | 看懂 `querySelector` | 實作為主 | `querySelector`、`querySelectorAll` | 選取頁面中的 input、button、section | 能正確選到指定元素 |
| 10 | 事件 click | 看懂按鈕事件 | UI 互動練習 | `addEventListener('click')` | 點按鈕切換文字 | 能追出 click 後執行哪個 function |
| 11 | class 操作 | 看懂顯示 / 隱藏切換 | UI 互動練習 | `classList.add/remove/toggle` | 做展開收合區塊 | 能說明 class 如何影響畫面 |
| 12 | input / select 取值 | 看懂表單欄位資料 | 表單練習 | `input.value`、select value、checkbox checked | 做簡單搜尋欄位 | 能取得使用者輸入 |
| 13 | submit 事件 | 看懂表單送出前處理 | 表單練習 | `submit`、`preventDefault` | 做表單送出前驗證 | 能避免表單直接刷新頁面 |
| 14 | 第 2 週回顧 | 建立 DOM / event 基礎 | 回顧 + 專案閱讀 | 找專案中一個按鈕事件 | 畫出「點擊後流程」 | 能說明一個互動流程 |
| 15 | Object 基礎 | 看懂 `{}` 資料 | 語法 + 資料情境 | property、dot notation、bracket notation | 建立一筆 user 資料 | 能讀取 object 欄位 |
| 16 | Array 基礎 | 看懂 `[]` 資料列表 | 語法 + 列表情境 | array index、length、push | 建立使用者清單 | 能取得陣列資料 |
| 17 | Array + Object | 看懂常見 API 資料格式 | 資料閱讀 | users array、每筆 user object | 顯示使用者名稱列表 | 能理解列表資料結構 |
| 18 | forEach | 看懂逐筆處理 | 列表練習 | `forEach` render 資料 | 把 user list 顯示到畫面 | 能說出每一筆資料如何被處理 |
| 19 | map | 看懂資料轉換 | 資料處理練習 | `map` 產生新陣列 | 將狀態代碼轉成顯示文字 | 能分辨 map 和 forEach |
| 20 | filter | 看懂篩選邏輯 | 搜尋 / 篩選練習 | `filter` 篩選啟用資料 | 做啟用 / 停用篩選 | 能解釋篩選條件 |
| 21 | 第 3 週回顧 | 整理 array / object 基礎 | 回顧 + 小測 | 閱讀專案中列表資料 | 找出一個 table 的資料來源 | 能描述資料長相 |
| 22 | find / some / every | 看懂搜尋與檢查 | 資料處理 | `find` 找單筆、`some` 檢查是否存在、`every` 檢查全部符合 | 檢查某使用者是否存在 | 能選對方法使用 |
| 23 | includes | 看懂關鍵字判斷 | 搜尋功能練習 | string / array includes | 做關鍵字搜尋 | 能完成簡單搜尋 |
| 24 | 解構賦值 | 看懂 `const { name } = user` | 專案語法閱讀 | object destructuring、array destructuring | 改寫 object 取值 | 能看懂解構語法 |
| 25 | Template Literals | 看懂 `${}` | 字串組合練習 | 組 HTML、組訊息文字 | 顯示「姓名 + 狀態」 | 能讀懂專案中的字串模板 |
| 26 | Optional Chaining | 看懂 `?.` | 防錯語法 | `user?.profile?.name` | 處理資料可能不存在的狀況 | 能理解避免錯誤的原因 |
| 27 | Nullish Coalescing | 看懂 `??` | 預設值處理 | `value ?? '未填寫'` | 欄位空值時顯示預設文字 | 能分辨 `??` 和一般判斷 |
| 28 | 第 4 週回顧 | 能讀懂常見資料處理 | 專案閱讀 + 筆記 | 找專案中 `map/filter/find` | 整理 5 段專案資料處理程式 | 能口頭解釋其中 2 段 |
| 29 | 非同步概念 | 知道為什麼 API 不是立即回來 | 概念理解 | 同步 / 非同步、callback 概念 | 用生活情境解釋非同步 | 能說出非同步用途 |
| 30 | Promise 基礎 | 看懂 `.then()` | 語法閱讀 | Promise pending / resolved / rejected | 閱讀一段 `.then()` 程式 | 能說明成功後做什麼 |
| 31 | async / await | 看懂現代非同步寫法 | 語法 + 練習 | `async function`、`await` | 改寫簡單 Promise 為 await | 能辨識 await 等資料回來 |
| 32 | fetch / AJAX 概念 | 知道前端如何拿資料 | API 概念 | request、response、JSON | 呼叫假 API 或閱讀專案 API | 能說明資料從哪裡來 |
| 33 | GET API | 看懂列表資料載入 | API 練習 | GET list、render list | 取得資料後顯示列表 | 能追蹤載入流程 |
| 34 | POST API | 看懂表單送出 | API 練習 | POST form data | 模擬送出表單 | 能說明送出的資料內容 |
| 35 | 第 5 週回顧 | 建立 API 基礎理解 | 專案閱讀 | 找專案中一個 API function | 畫出 API 呼叫流程 | 能說出 request / response |
| 36 | try / catch | 看懂錯誤處理 | 錯誤情境練習 | API 失敗、try catch | API 失敗時顯示錯誤訊息 | 能說明 catch 何時執行 |
| 37 | loading 狀態 | 看懂載入中 UI | UI + API 練習 | loading true / false | 做載入中提示 | 能避免使用者誤判畫面 |
| 38 | error message | 看懂錯誤訊息顯示 | UI + API 練習 | validation error、server error | 顯示錯誤訊息區塊 | 能區分前端 / 後端錯誤 |
| 39 | HTTP method | 看懂 GET / POST / PUT / DELETE | API 閱讀 | 查詢、新增、修改、刪除 | 對照專案 API 命名 | 能判斷 API 大概用途 |
| 40 | status code | 看懂基本回應狀態 | API 閱讀 | 200、400、401、403、404、500 | 整理專案常見錯誤處理 | 能說出常見狀態碼含義 |
| 41 | 表單驗證流程 | 看懂 submit 前後邏輯 | 專案情境 | 前端驗證、API 驗證、成功導頁 | 追一個表單送出流程 | 能描述 submit 完整流程 |
| 42 | 第 6 週回顧 | 能追 API 與表單流程 | 小測 + code review | 閱讀一個列表頁與表單頁 | 寫出流程筆記 | 能說明資料流 |
| 43 | 專案結構認識 | 看懂資料夾分工 | 專案閱讀 | pages、components、utils、services | 畫出 `intranet` 專案結構 | 能找到頁面入口 |
| 44 | JS 檔案命名 | 看懂檔案職責 | 專案閱讀 | page js、component js、helper js | 整理 5 個 JS 檔案用途 | 能猜出檔案負責功能 |
| 45 | 共用 function | 看懂 util / helper | 專案閱讀 | format、validate、date、permission | 找 3 個共用 function | 能說明何時會用到 |
| 46 | API service | 看懂 API 封裝 | 專案閱讀 | service function、endpoint、params | 找一支列表 API | 能追到 API 呼叫位置 |
| 47 | Component 概念 | 看懂可重用 UI 邏輯 | 專案閱讀 | modal、table、form、button | 找一個共用元件 | 能說明它被哪裡使用 |
| 48 | 狀態與畫面更新 | 看懂資料改變後畫面變化 | 專案閱讀 | state、data、render、set function | 追一個資料更新畫面流程 | 能指出資料在哪裡改變 |
| 49 | 第 7 週回顧 | 建立讀專案方法 | 筆記整理 | 完成一份頁面閱讀筆記 | 選 `intranet` 一頁做分析 | 能用筆記講解頁面 |
| 50 | digicare 專案閱讀 1 | 熟悉第二個專案結構 | 專案閱讀 | 找入口、頁面、API、共用工具 | 畫出 `digicare` 專案結構 | 能比較兩專案差異 |
| 51 | digicare 專案閱讀 2 | 追列表頁流程 | 專案閱讀 | 頁面載入、API、資料顯示 | 分析一個列表頁 | 能說明列表資料來源 |
| 52 | digicare 專案閱讀 3 | 追表單頁流程 | 專案閱讀 | 欄位、驗證、submit、API | 分析一個表單頁 | 能說明送出流程 |
| 53 | 常見套件閱讀 | 看懂專案第三方套件用途 | 專案閱讀 | table、date、modal、chart、form library | 整理專案常見套件表 | 能說明套件解決什麼問題 |
| 54 | 權限判斷 | 看懂顯示 / 隱藏權限邏輯 | 專案閱讀 | role、permission、canView、canEdit | 找一段權限控制 | 能說明誰可以看到什麼 |
| 55 | 小任務 1 | 修改低風險 UI 顯示 | 實作 + review | 新增欄位、改顯示文字、調整狀態 label | 修改一個列表欄位 | PR / code review 通過 |
| 56 | 第 8 週回顧 | 整理專案閱讀成果 | 筆記 + 分享 | 整理 intranet / digicare 各一頁 | 做 10 分鐘分享 | 能清楚說出兩頁流程 |
| 57 | 小任務 2 | 修改簡單互動 | 實作 | 新增按鈕事件、modal 內容、tab 行為 | 完成一個互動修改 | 功能可正常操作 |
| 58 | 小任務 3 | 修改表單驗證 | 實作 | 新增必填、格式判斷、錯誤訊息 | 完成一個驗證條件修改 | 測試正常 / 異常情境 |
| 59 | 小任務 4 | 修改 API 後資料顯示 | 實作 | response 欄位判斷、狀態顯示、loading | 調整一個 API response 顯示邏輯 | 能處理成功 / 失敗 |
| 60 | 總結與評估 | 判斷是否可接簡單 JS 任務 | Demo + code review | 回顧 60 天筆記、展示小任務 | 說明自己修改過的功能 | 能獨立說明程式流程 |

## 最終評估標準

| 能力 | 通過標準 |
|---|---|
| 基礎語法 | 能看懂變數、條件、函式、array、object |
| DOM / 事件 | 能追按鈕、表單、彈窗互動 |
| 資料處理 | 能看懂 `map/filter/find/forEach` |
| API | 能追 GET / POST 流程 |
| 專案閱讀 | 能找出頁面入口、API、主要事件 |
| 小任務 | 能在 code review 協助下完成低風險修改 |

## 每日學習紀錄模板

```md
日期：
Day：

今天學了什麼：

今天看了哪個專案檔案：

我看懂的地方：

我卡住的地方：

明天想問的問題：
```

## 頁面閱讀筆記模板

```md
頁面名稱：
所屬專案：intranet / digicare
入口檔案：
相關 JS 檔案：
使用到的 API：
主要事件：
主要資料：

我看懂的地方：

我看不懂的地方：

點擊 / submit / API 流程：
1.
2.
3.
```

