# FlowForm API

本文件依照目前 `backend/shared/controller.js`、`service.js`、`validation.js` 與本機 SQLite 實作整理，可直接作為前端串接參考。

## 目前完成範圍

- 本機 Express＋SQLite 已完成並通過測試。
- Cloudflare Worker 程式位於 `backend/worker/`，但本階段尚未同步 D1 DAO 與新 migration，也尚未重新部署。
- 在 D1 同步完成前，請勿把本文件新增的角色列表功能視為線上環境已完成。

## 前端共通設定

所有 API 路徑都以 `/api` 開頭。有 request body 的端點使用 JSON：

```js
const response = await fetch('/api/example', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  credentials: 'include',
  body: JSON.stringify(payload)
})
```

登入狀態由名為 `flowform_session` 的 HttpOnly Cookie 保存：

- JavaScript 不能也不需要讀取 Cookie 內容。
- 瀏覽器在後續 request 自動攜帶 Cookie。
- 本機前端透過 Vite proxy 呼叫 `/api/*`；線上前端與 Worker API 同源。
- 這兩種情況下，fetch 預設的 `credentials: "same-origin"` 已能攜帶 Cookie，因此 `credentials: "include"` 並非技術上不可缺少。不過建議所有登入相關 request 明確寫上，讓用途清楚且行為一致。
- 不要把 Session token 存進 Pinia、localStorage 或 sessionStorage。

帳號會由後端移除頭尾空白並轉成小寫。一般新建立的 user 與 registration 保存 12 小時；Session 與 Cookie 保存 2 小時且不自動延長。既有資料保留原本的 `expires_at`。

### 一般錯誤格式

```json
{
  "message": "錯誤說明",
  "code": "ERROR_CODE"
}
```

欄位驗證失敗時會多出 `errors`：

```json
{
  "message": "報名資料格式不正確",
  "code": "VALIDATION_ERROR",
  "errors": {
    "email": "此欄位為必填"
  }
}
```

共通錯誤：

| HTTP 狀態 | code | 發生時機 |
| --- | --- | --- |
| `400` | `INVALID_JSON` | JSON body 格式損壞 |
| `404` | `NOT_FOUND` | API 路徑或 HTTP method 不存在 |
| `500` | `INTERNAL_SERVER_ERROR` | 非預期伺服器錯誤 |
| `503` | `DATABASE_NOT_CONFIGURED` | Worker 沒有 D1 binding；health check 除外 |

## 前端登入串接順序

```text
POST /api/login
        ↓
GET /api/auth/me
        ↓
GET /api/registrations
        ↓
POST /api/logout
```

1. 登入成功後，將 response 的 `user` 放進 Pinia。前端只需要保存 `registrationId`、`account`、`name`、`registrationType`、`role`，不保存 Cookie 或密碼。
2. 頁面重新整理時 Pinia 記憶體會消失；App 啟動後呼叫 `GET /api/auth/me`，成功便用回傳的 `user` 恢復登入狀態。
3. 已確認登入後呼叫 `GET /api/registrations`。`admin` 會取得全部資料，`user` 只會取得自己的資料。
4. 登出時呼叫 `POST /api/logout`，成功後再清除 Pinia user 並導向登入頁。
5. Cookie 缺少、被撤銷、Session 到期或一般 user 資料到期時，受保護 API 回傳 `401 UNAUTHENTICATED`；前端應清除登入狀態並導回登入頁。

`role` 與資料範圍完全由後端根據 Session 判斷。前端不能傳入 `role` 或 `userId` 來取得其他人的資料，也不能先下載全部資料再隱藏。

## GET /api/health

### 功能與使用時機

確認 API 程式可以回應。不需要登入，也不需要 D1 binding。

### Request

```http
GET /api/health
```

沒有 request body。

### Success response

`200 OK`

```json
{
  "status": "ok"
}
```

### fetch 範例

```js
const response = await fetch('/api/health')
const data = await response.json()
```

此端點沒有設定 `Cache-Control: no-store`。

## POST /api/check-account

### 功能與使用時機

Step03 帳號欄位通過本地格式驗證後，檢查帳號目前是否可用。不需要登入。這只提供即時提示，不會保留帳號；正式報名時仍會再次檢查資料庫唯一限制。

### Request body

```json
{
  "account": "xiaoming"
}
```

`account` 必須是非空字串。長度等規則目前由 Step03 前端驗證。

### Success response

帳號可用與不可用都回傳 `200 OK`：

```json
{
  "message": "此帳號可以使用",
  "account": "xiaoming",
  "available": true
}
```

```json
{
  "message": "此帳號已被使用",
  "account": "admin",
  "available": false
}
```

`available` 才是前端判斷結果的欄位。資料庫已有帳號，或帳號屬於 `admin`、`test`、`flowform`、`user123` 等保留名稱時為 `false`。

### Errors

`400 INVALID_ACCOUNT`：缺少 account、不是字串或只有空白。

### fetch 範例

```js
const response = await fetch('/api/check-account', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ account })
})
const data = await response.json()
```

此端點沒有設定 `Cache-Control: no-store`。

## POST /api/registrations

### 功能與使用時機

Step04 確認後建立一般 user 與其 registration。不需要登入，也不會自動建立 Session。後端固定將角色設為 `user`，且固定視為一般 12 小時資料；request 中即使加入 `role`、`retentionExempt` 或 `seedBatch` 也不會生效。

### Request body

```json
{
  "name": "王小明",
  "email": "test@example.com",
  "phone": "0912345678",
  "identity": "developer",
  "company": "FlowForm",
  "department": "前端部門",
  "jobTitle": "前端工程師",
  "interests": ["Edge Computing", "DevOps"],
  "account": "xiaoming",
  "password": "Abcd12345"
}
```

| 欄位 | 必填 | 後端規則 |
| --- | --- | --- |
| `name` | 是 | 非空字串 |
| `email` | 是 | 非空字串 |
| `phone` | 是 | 非空字串 |
| `identity` | 是 | `developer`、`devops`、`student`、`manager`、`designer`、`vip`、`speaker`、`public` 之一 |
| `account` | 是 | 非空字串；儲存前移除頭尾空白並轉小寫 |
| `password` | 是 | 8～20 字元，至少一個大寫字母、小寫字母及數字 |
| `company` | 否 | 有提供時必須是字串 |
| `department` | 否 | 有提供時必須是字串 |
| `jobTitle` | 否 | 有提供時必須是字串 |
| `interests` | 否 | 有提供時必須是陣列 |

identity 對應的 registrationType：

| identity | registrationType |
| --- | --- |
| `student` | `學生` |
| `vip`、`speaker` | `VIP` |
| 其餘允許值 | `一般` |

### Success response

`201 Created`

```json
{
  "message": "報名成功",
  "registration": {
    "registrationId": "550e8400-e29b-41d4-a716-446655440000",
    "status": "registered",
    "name": "王小明",
    "email": "test@example.com",
    "registrationType": "一般"
  }
}
```

### Errors

- `400 VALIDATION_ERROR`：欄位驗證失敗，並在 `errors` 提供各欄位訊息。
- `409 ACCOUNT_TAKEN`：保留帳號或資料庫帳號衝突。

### fetch 範例

```js
const response = await fetch('/api/registrations', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(registrationPayload)
})
const data = await response.json()
```

此端點沒有設定 `Cache-Control: no-store`。

## POST /api/login

### 功能與使用時機

管理員與一般會員共用此登入 API。成功後建立 2 小時 Session，response 會設定 HttpOnly Cookie。

### Request body

```json
{
  "account": "xiaoming",
  "password": "Abcd12345"
}
```

account 與 password 都必須是非空字串。

### User success response

`200 OK`

```json
{
  "message": "登入成功",
  "user": {
    "registrationId": "550e8400-e29b-41d4-a716-446655440000",
    "account": "xiaoming",
    "name": "王小明",
    "registrationType": "一般",
    "role": "user"
  }
}
```

### Admin success response

管理員不需要 registration，因此相關欄位為 `null`：

```json
{
  "message": "登入成功",
  "user": {
    "registrationId": null,
    "account": "admin-example",
    "name": null,
    "registrationType": null,
    "role": "admin"
  }
}
```

response 會包含：

```http
Set-Cookie: flowform_session=<random-token>; HttpOnly; SameSite=Lax; Path=/; Max-Age=7200
Cache-Control: no-store
```

線上 Cookie 會多出 `Secure`。資料庫只保存 Session token 的 SHA-256 hash。

### Errors

- `400 INVALID_LOGIN_DATA`：缺少帳號或密碼，或型別不正確。
- `401 INVALID_CREDENTIALS`：帳號不存在或密碼錯誤。兩者刻意使用相同回應，避免透露帳號是否存在。

### fetch 範例

```js
const response = await fetch('/api/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({ account, password })
})
const data = await response.json()
```

成功與錯誤回應都使用 `Cache-Control: no-store`。

## GET /api/auth/me

### 功能與使用時機

檢查 Cookie 對應的 Session，並在重新整理後恢復 Pinia 登入狀態。需要登入。

### Request

```http
GET /api/auth/me
Cookie: flowform_session=<random-token>
```

沒有 request body。

### Success response

`200 OK`，`user` 格式與登入成功相同。

```json
{
  "user": {
    "registrationId": "550e8400-e29b-41d4-a716-446655440000",
    "account": "xiaoming",
    "name": "王小明",
    "registrationType": "一般",
    "role": "user"
  }
}
```

### Errors

Cookie 缺少、Session 已撤銷、Session 已到期或一般 user 資料已到期時：

`401 UNAUTHENTICATED`

```json
{
  "message": "尚未登入",
  "code": "UNAUTHENTICATED"
}
```

### fetch 範例

```js
const response = await fetch('/api/auth/me', {
  credentials: 'include'
})
const data = await response.json()
```

成功與錯誤回應都使用 `Cache-Control: no-store`。

## GET /api/registrations

### 功能與使用時機

取得登入者有權限查看的報名列表。需要登入。資料權限由後端 Session user 決定：

- `admin`：取得全部 registration。
- `user`：只取得自己的 registration。
- 其他角色：拒絕存取。

前端不傳 role、userId、搜尋或分頁參數。第一版由前端對已授權的資料做搜尋、篩選、排序與分頁。

### Request

```http
GET /api/registrations
Cookie: flowform_session=<random-token>
```

沒有 request body。

### Success response

`200 OK`

```json
{
  "registrations": [
    {
      "registrationId": "550e8400-e29b-41d4-a716-446655440000",
      "status": "registered",
      "registrationType": "一般",
      "name": "王小明",
      "email": "test@example.com",
      "phone": "0912345678",
      "identity": "developer",
      "company": "FlowForm",
      "department": "前端部門",
      "jobTitle": "前端工程師",
      "interests": ["Edge Computing", "DevOps"],
      "account": "xiaoming",
      "createdAt": 1789065600000
    }
  ]
}
```

沒有資料時仍回傳相同格式：

```json
{
  "registrations": []
}
```

欄位說明：

- `registrationId`：報名紀錄 ID。
- `status`：目前為 `registered`。
- `registrationType`：由 identity 轉換的 `一般`、`學生` 或 `VIP`。
- `interests`：字串陣列。
- `account`：該報名紀錄所屬 user 的帳號。
- `createdAt`：報名建立時間，Unix timestamp，單位為毫秒。
- response 不包含密碼雜湊、Session token/hash、`retention_exempt`、`seed_batch` 等內部欄位。

### Errors

- `401 UNAUTHENTICATED`：沒有有效登入狀態。
- `403 FORBIDDEN`：登入 user 的角色不是 `admin` 或 `user`。

### fetch 範例

```js
const response = await fetch('/api/registrations', {
  credentials: 'include'
})

if (response.status === 401) {
  // 清除 Pinia 登入狀態並導向登入頁
}

const data = await response.json()
```

成功與錯誤回應都使用 `Cache-Control: no-store`。

## POST /api/logout

### 功能與使用時機

撤銷目前 Session 並清除 Cookie。即使沒有 Cookie 或 Session 已經失效，也會安全完成。登入頁或後台的登出按鈕使用此端點。

### Request

```http
POST /api/logout
Cookie: flowform_session=<random-token>
```

沒有 request body。

### Success response

`204 No Content`，沒有 response body。response 會設定 `Max-Age=0` 清除 Cookie。

### fetch 範例

```js
await fetch('/api/logout', {
  method: 'POST',
  credentials: 'include'
})
```

此端點使用 `Cache-Control: no-store`。

## 本機開發操作

以下是本機 CLI，不是公開 API。指令必須在 `backend/` 目錄執行，且不會連線到遠端 D1。

### 建立或更新管理員

```bash
FLOWFORM_ADMIN_ACCOUNT='<管理員帳號>' \
FLOWFORM_ADMIN_PASSWORD='<管理員密碼>' \
pnpm run admin:create
```

- 密碼必須為 8～20 字元，並包含大小寫英文字母與數字。
- CLI 不會印出明碼密碼，也不建立 registration。
- 同一帳號再次執行會更新原管理員密碼，不新增重複 user，並撤銷該管理員既有 Session。
- 如果該帳號已存在但角色不是 admin，CLI 會拒絕覆蓋。
- 可啟動本機 API 後用 `POST /api/login`，再以 `GET /api/auth/me` 確認 `role` 為 `admin` 且 registration 欄位為 `null`。

### 建立或重設 100 筆 dashboard seed

```bash
pnpm run seed:dashboard
pnpm run seed:dashboard:reset
```

- 每次建立都會得到固定 100 筆虛構 registration。
- 每個 seed user 都使用隨機、未公開且執行後丟棄的密碼建立合法 PBKDF2 record。
- 重複執行會替換同一批資料，不會累加。
- reset 只移除 `dashboard-v1` 批次，不影響管理員、一般會員或測試會員。

### 建立或重設 2 個可登入測試會員

```bash
FLOWFORM_TEST_MEMBER_PASSWORD='<共用測試密碼>' \
pnpm run seed:test-members

pnpm run seed:test-members:reset
```

固定測試帳號：

- `member-test-01`
- `member-test-02`

密碼由執行時的 `FLOWFORM_TEST_MEMBER_PASSWORD` 提供，不寫入程式或 Git。重複建立不會累加；reset 只移除 `member-access-v1` 批次。

## Cache-Control: no-store 對照

| API | no-store |
| --- | --- |
| `POST /api/login` | 是 |
| `POST /api/logout` | 是 |
| `GET /api/auth/me` | 是 |
| `GET /api/registrations` | 是 |
| `GET /api/health` | 否 |
| `POST /api/check-account` | 否 |
| `POST /api/registrations` | 否 |

`GET /api/registrations/me` 已在角色化列表 API 通過本機 admin/user 權限測試後移除，不再是可用端點。
