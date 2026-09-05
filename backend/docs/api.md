## 檢查帳號是否可用

### Request

POST /api/check-account

Content-Type: application/json

{
  "account": "xiaoming"
}

### Available Account Response

200 OK

{
  "message": "此帳號可以使用",
  "account": "xiaoming",
  "available": true
}

### Unavailable Account Response

200 OK

{
  "message": "此帳號已被使用",
  "account": "admin",
  "available": false
}

### Invalid Account Error

400 Bad Request

{
  "message": "請提供要檢查的帳號",
  "code": "INVALID_ACCOUNT"
}

## 建立報名資料

### Request

POST /api/registrations

Content-Type: application/json

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

### Success Response

201 Created

{
  "message": "報名成功",
  "registration": {
    "status": "registered",
    "name": "王小明",
    "email": "test@example.com",
    "registrationType": "一般",
    "registrationId": "UUID"
  }
}

### Validation Error

400 Bad Request

{
  "message": "報名資料格式不正確",
  "code": "VALIDATION_ERROR",
  "errors": {
    "email": "此欄位為必填"
  }
}

### Account Conflict

409 Conflict

{
  "message": "此帳號已被使用，請返回上一步更換帳號",
  "code": "ACCOUNT_TAKEN"
}
