# bcryptjs cost 10 測試結果

測試日期：2026-09-08

## 測試對象

- Worker：`flowform-bcrypt-cost10-test`
- URL：`https://flowform-bcrypt-cost10-test.flowform-bcrypt-cost10-test.workers.dev`
- 套件：`bcryptjs` 3.0.3
- bcrypt cost：10
- 測試端點：`POST /benchmark`

## 結果

端點回傳 HTTP 200，且密碼比對結果為 `matched: true`。

Cloudflare Tail 的實際 invocation 資訊：

```text
cpuTime: 180 ms
wallTime: 186 ms
outcome: ok
```

Worker Free 的 HTTP request CPU 額度為 10 ms。此次 CPU 使用量超過該額度，
因此 bcryptjs cost 10 不適合作為 FlowForm 在 Workers Free 上的穩定密碼雜湊方案。

端點內以 `performance.now()` 計算的數值皆為 0 ms；此數值不作為判定依據，
以 Cloudflare Tail 回傳的 `cpuTime` 為準。

## 後續決策

- 不降低 bcrypt cost。
- 不儲存明碼密碼。
- 不對現有 frontend 或 backend 進行改造。
- 下一步只在本測試目錄評估 Web Crypto PBKDF2 的安全參數與實際 CPU 使用量。

## PBKDF2-HMAC-SHA-256 600,000 iterations 測試結果

測試日期：2026-09-08

### 測試對象

- Worker：`flowform-pbkdf2-test`
- URL：`https://flowform-pbkdf2-test.flowform-bcrypt-cost10-test.workers.dev`
- 演算法：PBKDF2-HMAC-SHA-256
- iterations：600,000（未降低）
- 測試端點：`POST /benchmark/hash`

### 第一筆結果與停止原因

第一筆 hash 請求回傳 HTTP 500。Cloudflare Tail 顯示：

```text
cpuTime: 0 ms
wallTime: 1 ms
outcome: exception
NotSupportedError: Pbkdf2 failed: iteration counts above 100000 are not supported (requested 600000).
```

這是 Cloudflare Workers Web Crypto 對 PBKDF2 iterations 的硬性上限（100,000），
不是效能超限。600,000 iterations 因此無法在此 runtime 執行，重試剩餘 hash 或
verify 請求不會產生新的有效資訊，故依決定停止測試；未降低正式安全參數。

### 後續決策

- 不採用低於 600,000 iterations 的 PBKDF2 取代方案。
- 不修改 frontend、backend，也不再部署其他測試 Worker。

## PBKDF2-HMAC-SHA-256 100,000 iterations 測試結果

測試日期：2026-09-08

### 測試對象

- Worker：`flowform-pbkdf2-test`
- URL：`https://flowform-pbkdf2-test.flowform-bcrypt-cost10-test.workers.dev`
- 演算法：PBKDF2-HMAC-SHA-256
- iterations：100,000
- derived key：32 bytes（256 bits）
- hash salt：每次隨機 16 bytes
- verify salt／hash：預先建立的固定測試值

### 六筆獨立請求

| 順序 | mode | HTTP status | matched | cpuTime | wallTime | outcome |
| ---: | --- | ---: | --- | ---: | ---: | --- |
| 1 | hash | 200 | true | 21 ms | 22 ms | ok |
| 2 | hash | 200 | true | 19 ms | 20 ms | ok |
| 3 | hash | 200 | true | 19 ms | 20 ms | ok |
| 4 | verify | 200 | true | 22 ms | 22 ms | ok |
| 5 | verify | 200 | true | 25 ms | 27 ms | ok |
| 6 | verify | 200 | true | 19 ms | 20 ms | ok |

功能測試 6/6 成功，但 CPU 19–25ms 高於 Workers Free 10ms 額度，因此僅能作為低流量 Demo 的風險接受方案，不能宣稱符合 Free CPU 限制或 production-ready。
