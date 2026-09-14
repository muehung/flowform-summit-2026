# FlowForm API

本文件以目前 `backend/shared/controller.js`、`service.js` 與 `validation.js` 的實際行為為準。

## 共通規則

- API 路徑皆以 `/api` 開頭。
- 有 request body 的端點使用 `Content-Type: application/json`。
- 帳號在後端會先移除頭尾空白並轉成小寫。
- `users`、`registrations` 與 `sessions` 目前皆採 30 分鐘期限。
- 到期與已撤銷的資料會在後續相關 API 請求中清理。
- 登入狀態使用名為 `flowform_session` 的 HttpOnly Cookie。
- 本機透過 Vite proxy 呼叫 API；Cloudflare 線上環境由同源 Worker 處理 API。

### 一般錯誤格式

```json
{
  "message": "錯誤說明",
  "code": "ERROR_CODE"
}
```

欄位驗證失敗時會額外包含 `errors`：

```json
{
  "message": "報名資料格式不正確",
  "code": "VALIDATION_ERROR",
  "errors": {
    "email": "此欄位為必填"
  }
}
```

### 共通錯誤

#### JSON 格式錯誤

`400 Bad Request`

```json
{
  "message": "JSON 格式不正確",
  "code": "INVALID_JSON"
}
```

#### API 路徑或 HTTP method 不存在

`404 Not Found`

```json
{
  "message": "API route not found",
  "code": "NOT_FOUND"
}
```

#### 非預期伺服器錯誤

`500 Internal Server Error`

```json
{
  "message": "系統暫時無法處理請求，請稍後再試",
  "code": "INTERNAL_SERVER_ERROR"
}
```

Cloudflare Worker 未設定 D1 binding 時，除 health check 外的 API 會回傳：

`503 Service Unavailable`

```json
{
  "message": "D1 binding 尚未設定",
  "code": "DATABASE_NOT_CONFIGURED"
}
```

## Health check

確認 API 程式是否可以回應。此端點不需要登入，也不需要 D1 binding。

### Request

```http
GET /api/health
```

### Success response

`200 OK`

```json
{
  "status": "ok"
}
```

## 檢查帳號是否可用

此端點不需要登入。帳號可用性只提供即時提示，不會保留帳號；建立報名資料時仍會再次由資料庫唯一限制確認。

### Request

```http
POST /api/check-account
Content-Type: application/json
```

```json
{
  "account": "xiaoming"
}
```

### Available account response

`200 OK`

```json
{
  "message": "此帳號可以使用",
  "account": "xiaoming",
  "available": true
}
```

### Unavailable account response

已存在於資料庫，或屬於 `admin`、`test`、`flowform`、`user123` 等保留帳號時，仍以 `200 OK` 回應，並將 `available` 設為 `false`。

```json
{
  "message": "此帳號已被使用",
  "account": "admin",
  "available": false
}
```

### Invalid account error

`account` 不是字串、缺少或只有空白時：

`400 Bad Request`

```json
{
  "message": "請提供要檢查的帳號",
  "code": "INVALID_ACCOUNT"
}
```

> 帳號長度等輸入規則目前由 Step03 前端驗證；此端點的後端驗證目前只檢查是否為非空字串。

## 建立報名資料

此端點不需要登入。成功時會同時建立 user 與 registration，但不會自動登入或建立 Session。

### Request

```http
POST /api/registrations
Content-Type: application/json
```

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

### 欄位規則

| 欄位 | 必填 | 後端目前的規則 |
| --- | --- | --- |
| `name` | 是 | 非空字串 |
| `email` | 是 | 非空字串 |
| `phone` | 是 | 非空字串 |
| `identity` | 是 | 非空字串，且必須是允許的選項 |
| `account` | 是 | 非空字串；儲存前會移除頭尾空白並轉成小寫 |
| `password` | 是 | 8～20 個字元，至少包含一個大寫字母、一個小寫字母及一個數字 |
| `company` | 否 | 有提供時必須是字串 |
| `department` | 否 | 有提供時必須是字串 |
| `jobTitle` | 否 | 有提供時必須是字串 |
| `interests` | 否 | 有提供時必須是陣列 |

`identity` 允許以下值：

| identity | registrationType |
| --- | --- |
| `developer` | `一般` |
| `devops` | `一般` |
| `student` | `學生` |
| `manager` | `一般` |
| `designer` | `一般` |
| `vip` | `VIP` |
| `speaker` | `VIP` |
| `public` | `一般` |

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

### Validation error

`400 Bad Request`

```json
{
  "message": "報名資料格式不正確",
  "code": "VALIDATION_ERROR",
  "errors": {
    "email": "此欄位為必填",
    "password": "密碼需為 8 到 20 個字元，且包含大小寫英文字母與數字"
  }
}
```

### Account conflict

帳號屬於保留帳號，或在帳號檢查後已被其他 registration 使用時：

`409 Conflict`

```json
{
  "message": "此帳號已被使用，請返回上一步更換帳號",
  "code": "ACCOUNT_TAKEN"
}
```

## 登入

驗證帳號密碼，成功後建立 Session，並透過 response header 設定 Cookie。

### Request

```http
POST /api/login
Content-Type: application/json
```

```json
{
  "account": "xiaoming",
  "password": "Abcd12345"
}
```

### Success response

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

Response 同時包含類似以下 header：

```http
Set-Cookie: flowform_session=<random-token>; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=1800
```

- Cloudflare 線上環境包含 `Secure`。
- 本機一般開發環境不包含 `Secure`，使 Cookie 可透過 HTTP localhost 傳送。
- 瀏覽器取得的是原始 Session token；資料庫只保存 token 的 SHA-256 hash。

### Invalid request error

帳號缺少、不是字串或只有空白，或密碼缺少、不是字串或為空字串時：

`400 Bad Request`

```json
{
  "message": "請輸入帳號與密碼",
  "code": "INVALID_LOGIN_DATA"
}
```

### Invalid credentials error

帳號不存在或密碼不正確時使用相同錯誤，避免透露帳號是否存在。

`401 Unauthorized`

```json
{
  "message": "帳號或密碼錯誤",
  "code": "INVALID_CREDENTIALS"
}
```

## 登出

有 Session Cookie 時會撤銷資料庫中的 Session；無 Cookie 或 Session 已失效時也會安全地完成登出。

### Request

```http
POST /api/logout
Cookie: flowform_session=<random-token>
```

### Success response

`204 No Content`

Response 沒有 body，並透過以下 header 清除 Cookie：

```http
Set-Cookie: flowform_session=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0
```

本機一般開發環境的清除 Cookie header 不包含 `Secure`。

## 取得目前登入使用者

需要有效的 `flowform_session` Cookie。

### Request

```http
GET /api/auth/me
Cookie: flowform_session=<random-token>
```

### Success response

`200 OK`

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

### Unauthenticated error

Cookie 缺少、Session 已撤銷、Session 已到期或 user 已到期時：

`401 Unauthorized`

```json
{
  "message": "尚未登入",
  "code": "UNAUTHENTICATED"
}
```

## 取得目前使用者的報名資料

需要有效的 `flowform_session` Cookie。

### Request

```http
GET /api/registrations/me
Cookie: flowform_session=<random-token>
```

### Success response

`200 OK`

`createdAt` 與 `expiresAt` 為 Unix timestamp（毫秒）。

```json
{
  "registration": {
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
    "createdAt": 1789065600000,
    "expiresAt": 1789067400000
  }
}
```

### Unauthenticated error

Cookie 缺少、Session 已撤銷、Session 已到期或 user 已到期時：

`401 Unauthorized`

```json
{
  "message": "尚未登入",
  "code": "UNAUTHENTICATED"
}
```
