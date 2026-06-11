# API 設計

## 目次

- [権限レベル定義](#権限レベル定義)
- [認証](#認証)
- [エンドポイント一覧](#エンドポイント一覧)
- [エラーハンドリング](#エラーハンドリング)
- [ログ設計](#ログ設計)
- [CORS 設定](#cors-設定)
- [ディレクトリ構成](#ディレクトリ構成)
- [未決事項](#未決事項)

---

### 権限レベル定義

ロールは Cognito グループで管理する。`admin` グループに所属するユーザーを管理者、それ以外を一般ユーザーとして扱う。JWT の `cognito:groups` クレームをミドルウェアで検証することで判定する。

| 表記 | 意味 | Cognito グループ |
|---|---|---|
| `一般ユーザー` | 有効な Cognito JWT を持つユーザー。自分のリソースのみ操作可能 | なし |
| `管理者` | 全ユーザーのリソースを操作可能 | `admin` |
| `一般ユーザー / 管理者` | どちらでも可 | - |
| `スケジューラ` | M2M アクセストークンを持つシステム | - |

---

### 認証

| 呼び出し元 | 方式 |
|---|---|
| 一般ユーザー / 管理者 | `Authorization: Bearer <Cognito ID トークン>` |
| スケジューラ | `Authorization: Bearer <M2M アクセストークン>`（Cognito Client Credentials フロー） |

**ID トークンを使う理由:** `cognitoSub`（ユーザー識別）と `cognito:groups`（管理者判定）が含まれており、1つのトークンで認証・認可を完結できる。

**`:user_id` の所有者チェック:**

`/users/:user_id/` 配下のエンドポイントでは、ミドルウェアで所有者を検証する。管理者は任意の `:user_id` にアクセス可能。

**用語の関係:**
- JWT の `sub` クレーム = Cognito が発行するユーザー識別子（= DB の `User.cognitoSub`）
- URL の `:user_id` = DB の `User.id`（nanoid）

```
一般ユーザー: JWT の sub から User を取得し、User.id == :user_id の場合のみ許可
管理者:       cognito:groups に admin が含まれる場合は :user_id に関わらず許可
```

---

### エンドポイント一覧

#### Users

| メソッド | パス | 説明 | 権限 |
|---|---|---|---|
| `POST` | `/users` | ユーザー登録（Cognitoサインアップ後に一度だけ呼ぶ） | 一般ユーザー |
| `GET` | `/users` | ユーザー一覧取得 | 管理者 |
| `GET` | `/users/:user_id` | ユーザー情報取得 | 一般ユーザー / 管理者 |
| `PUT` | `/users/:user_id` | ユーザー情報更新 | 一般ユーザー / 管理者 |
| `DELETE` | `/users/:user_id` | ユーザー削除（関連データも Cascade 削除） | 一般ユーザー / 管理者 |

**備考:**
- `POST /users` のボディは空。`cognitoSub` は検証済み JWT のペイロードからサーバー側で取得する。レスポンスに `id` を含め、クライアントは以降この `id` を使う。
- 現時点で `User` に更新可能なフィールドがないため、`PUT /users/:user_id` は権限設計・スキーマ拡張後に実装する。

---

#### VulnerabilityConfigs

| メソッド | パス | 説明 | 権限 |
|---|---|---|---|
| `GET` | `/users/:user_id/vulnerability-configs` | ユーザーの設定一覧取得 | 一般ユーザー / 管理者 |
| `GET` | `/users/:user_id/vulnerability-configs/:ecosystem_id` | エコシステムごとの設定取得 | 一般ユーザー / 管理者 |
| `PUT` | `/users/:user_id/vulnerability-configs/:ecosystem_id` | 設定の作成・更新（upsert） | 一般ユーザー / 管理者 |
| `DELETE` | `/users/:user_id/vulnerability-configs/:ecosystem_id` | 設定削除 | 一般ユーザー / 管理者 |

**備考:**
- 1ユーザー × 1エコシステム = 1設定（DB に `@@unique([userId, ecosystemId])` 制約あり）。
- `PUT` は存在しなければ作成、存在すれば更新。

---

#### NotificationChannels

| メソッド | パス | 説明 | 権限 |
|---|---|---|---|
| `GET` | `/notification-channels` | 全ユーザーの通知チャネル一覧取得 | 管理者 |
| `GET` | `/users/:user_id/notification-channels` | ユーザーの通知チャネル一覧取得 | 一般ユーザー / 管理者 |
| `POST` | `/users/:user_id/notification-channels` | 通知チャネル作成 | 一般ユーザー / 管理者 |
| `GET` | `/users/:user_id/notification-channels/:notification_channel_id` | 通知チャネル詳細取得 | 一般ユーザー / 管理者 |
| `PUT` | `/users/:user_id/notification-channels/:notification_channel_id` | 通知チャネル更新 | 一般ユーザー / 管理者 |
| `DELETE` | `/users/:user_id/notification-channels/:notification_channel_id` | 通知チャネル削除 | 一般ユーザー / 管理者 |

**備考:**
- `:user_id` を URL に含めることで、他人のリソースへの不正操作を防ぐための「JWT の `user_id` と `:user_id` が一致するか」の検証をミドルウェアで一律に行える。ボディで受け取ると検証漏れが起きやすい。
- `type` フィールドで通知種別を区別する（例: `1` = LINE）。
- 現時点では LINE のみ実装。将来的に Slack・Email 等を追加できる設計。
- LINE チャネルの連携方式（`lineUserId` の取得方法）は実装フェーズで別途設計する。

---

#### Batches

| メソッド | パス | 説明 | 権限 |
|---|---|---|---|
| `POST` | `/batches` | バッチ実行 | 一般ユーザー / 管理者 / スケジューラ |
| `GET` | `/batches` | バッチ一覧取得 | 一般ユーザー / 管理者 |
| `GET` | `/batches/:batch_id` | バッチ詳細・実行状況取得 | 一般ユーザー / 管理者 |

**クエリパラメータ（`GET /batches`）:**

| パラメータ | 説明 | 例 |
|---|---|---|
| `trigger_type` | 実行種別で絞り込み | `?trigger_type=manual` / `?trigger_type=scheduled` |
| `cursor` | カーソルページネーション（前回レスポンスの `nextCursor` を指定） | `?cursor=<nextCursor>` |
| `limit` | 取得件数 | `?limit=20` |

**備考:**
- `POST /batches` の呼び出し元によって挙動が変わる:
  - 一般ユーザー / 管理者 → JWT から user_id を取得し、**自分の** `VulnerabilityConfig` のみを対象に実行（`triggerType`: 手動）
  - スケジューラ → 全ユーザーの `VulnerabilityConfig` を対象に実行（`triggerType`: スケジューラ）
- 管理者が全ユーザー分を実行したい場合はスケジューラ経由のみ。管理者の手動実行も自分のみを対象とする。
- `GET /batches` の返却内容:
  - 一般ユーザー: 自分が手動実行したバッチ + スケジューラバッチ
  - 管理者: 全バッチ
- `triggeredBy` フィールドで手動実行者を識別できる（スケジューラ実行時は `null`）

---

#### Vulnerabilities

| メソッド | パス | 説明 | 権限 |
|---|---|---|---|
| `GET` | `/vulnerabilities` | 全ユーザーの脆弱性一覧取得 | 管理者 |
| `GET` | `/users/:user_id/vulnerabilities` | ユーザーの脆弱性一覧取得 | 一般ユーザー / 管理者 |
| `GET` | `/vulnerabilities/:vulnerability_id` | 脆弱性詳細取得 | 一般ユーザー / 管理者 |
| `PUT` | `/vulnerabilities/:vulnerability_id` | 脆弱性更新 | 管理者 |
| `DELETE` | `/vulnerabilities/:vulnerability_id` | 脆弱性削除 | 管理者 |

**備考:**
- 脆弱性の作成は `POST /batches` のハンドラー内で行うため、作成エンドポイントは不要。
- `GET /vulnerabilities`・`GET /users/:user_id/vulnerabilities` はカーソルページネーション対応（`?cursor=<nextCursor>&limit=20`）。

---

#### Notifications

| メソッド | パス | 説明 | 権限 |
|---|---|---|---|
| `GET` | `/notifications` | 全ユーザーの通知履歴一覧取得 | 管理者 |
| `GET` | `/users/:user_id/notifications` | ユーザーの通知履歴一覧取得 | 一般ユーザー / 管理者 |
| `GET` | `/users/:user_id/notifications/:notification_id` | 通知履歴詳細取得 | 一般ユーザー / 管理者 |

**備考:**
- 通知の作成は `POST /batches` のハンドラー内で行うため、作成エンドポイントは不要。
- `GET /notifications`・`GET /users/:user_id/notifications` はカーソルページネーション対応（`?cursor=<nextCursor>&limit=20`）。

---

### エラーハンドリング

#### 基本原則

**RFC 9457（Problem Details for HTTP APIs）に準拠する。**

- 適切な HTTP ステータスコードでエラーの種類を正確に表現する
- 一貫性のある構造化されたエラーレスポンスを返す
- セキュアなエラーメッセージ（内部情報・スタックトレースを含めない）

#### セキュリティに関する考慮事項

**① 内部の詳細情報を公開しない**

スタックトレース・データベースクエリ・ファイルパス・内部サービス名は API レスポンスに含めない。

```json
// ❌ 内部情報が漏れる
{ "detail": "PostgreSQL error: duplicate key value violates unique constraint \"User_cognitoSub_key\"" }

// ✅ 安全
{ "detail": "Conflict" }
```

**② 認証エラーは中立的なメッセージを使用する**

「ユーザーが存在しない」と「パスワードが間違っている」を区別するメッセージはアカウント列挙攻撃に利用される。どちらの場合も同一のメッセージを返す。

```json
// ❌ 攻撃者にヒントを与える
{ "detail": "User not found" }
{ "detail": "Incorrect password" }

// ✅ 中立的
{ "detail": "Invalid credentials" }
```

**③ 入力値のサニタイズ**

ユーザーの入力値をエラーメッセージに含める前に必ず検証・サニタイズし、インジェクション攻撃を防ぐ。

#### フォーマット

**RFC 9457（Problem Details for HTTP APIs）** に準拠する。
Content-Type: `application/problem+json`

```json
// 通常エラー
{
  "type": "/problems/not-found",
  "title": "Not Found",
  "status": 404,
  "detail": "User not found",
  "instance": "/users/abc123"
}

// バリデーションエラー（RFC 9457 拡張フィールド）
{
  "type": "/problems/validation-error",
  "title": "Validation Error",
  "status": 422,
  "detail": "Validation failed",
  "instance": "/users/abc123/vulnerability-configs/npm",
  "errors": [
    { "field": "minSeverity", "message": "Must be between 1 and 10" }
  ]
}
```

#### エラータイプ一覧

`type` フィールドは RFC 9457 に基づく**エラー種別の識別子**として使用する相対 URI。実際にアクセス可能な URL ではなく、フロントエンドがエラーを分類・処理するためのキーとして機能する。`/problems/{エラー名}` の形式で統一する。

| type | status | title | message の方針 |
|---|---|---|---|
| `/problems/unauthorized` | 401 | `Unauthorized` | 固定文言 |
| `/problems/forbidden` | 403 | `Forbidden` | 固定文言 |
| `/problems/not-found` | 404 | `Not Found` | リソース名を含めてよい |
| `/problems/bad-request` | 400 | `Bad Request` | 固定文言 |
| `/problems/validation-error` | 422 | `Validation Error` | `errors` にフィールドごとのエラーを含める |
| `/problems/conflict` | 409 | `Conflict` | 固定文言 |
| `/problems/internal-server-error` | 500 | `Internal Server Error` | 固定文言（内部情報を含めない） |

#### Prisma エラーの HTTP ステータス変換

Prisma が投げる例外を適切な HTTP ステータスコードに変換する。内部のエラーコード・メッセージはレスポンスに含めない。

| Prisma エラーコード | 内容 | HTTP ステータス |
|---|---|---|
| `P2001` | レコードが見つからない | 404 |
| `P2002` | ユニーク制約違反 | 409 |
| `P2003` | 外部キー制約違反 | 400 |
| `P2011` | NULL 制約違反 | 400 |
| `P2014` | 必須リレーション違反 | 400 |
| `P2025` | 操作対象レコードが存在しない | 404 |
| `P1001` / `P1002` | DB 接続エラー | 500 |

---

### ログ設計

#### 基本方針

- ライブラリ: **Pino**
- 出力先: **標準出力（stdout）**（Docker がログを管理）
- フォーマット: **構造化ログ（JSON）**
- センシティブ情報は Pino の `redact` でマスク（構造化ログが前提）

#### ログレベル

| レベル | 使う場面 |
|---|---|
| `fatal` | DB 接続失敗等、起動不能な状態 |
| `error` | バッチ実行失敗・外部 API 呼び出し失敗 |
| `warn` | リトライ発生・設定値が推奨範囲外 |
| `info` | リクエスト受信・バッチ開始/完了・通知送信 |
| `debug` | 開発時のみ（本番では出力しない） |

#### 記録対象

| 項目 | 記録 |
|---|---|
| HTTP リクエスト（メソッド・パス・ステータス・レスポンスタイム） | ✅ |
| バッチ実行の開始・完了・失敗 | ✅ |
| 外部 API 呼び出し（GitHub Advisory・LINE） | ✅ |
| 認証エラー（401・403） | ✅ |
| DB クエリ | ❌ |
| ユーザーの個人情報 | ❌ |

#### 構造化ログフォーマット

**共通フィールド:**
```json
{
  "level": "info",
  "time": "2026-06-08T10:00:00.000Z",
  "requestId": "uuid-v4",
  "msg": "メッセージ"
}
```

**HTTP リクエスト:**
```json
{
  "level": "info",
  "time": "2026-06-08T10:00:00.000Z",
  "requestId": "uuid-v4",
  "msg": "request completed",
  "req": {
    "method": "GET",
    "url": "/users/abc123/vulnerabilities",
    "headers": { "authorization": "[Redacted]" }
  },
  "res": {
    "status": 200,
    "responseTime": 42
  }
}
```

**バッチ実行:**
```json
{
  "level": "info",
  "time": "2026-06-08T10:00:00.000Z",
  "requestId": "uuid-v4",
  "msg": "batch completed",
  "batch": {
    "batchId": "uuid-v7",
    "triggerType": "manual",
    "userId": "abc123",
    "fetchedCount": 10,
    "notifiedCount": 5,
    "durationMs": 3200
  }
}
```

**外部 API 呼び出し:**
```json
{
  "level": "info",
  "time": "2026-06-08T10:00:00.000Z",
  "requestId": "uuid-v4",
  "msg": "external api call completed",
  "externalApi": {
    "service": "githubAdvisory",
    "durationMs": 800,
    "status": 200
  }
}
```

**認証エラー:**
```json
{
  "level": "warn",
  "time": "2026-06-08T10:00:00.000Z",
  "requestId": "uuid-v4",
  "msg": "authentication failed",
  "req": {
    "method": "GET",
    "url": "/users/abc123/vulnerabilities"
  },
  "error": {
    "type": "/problems/unauthorized",
    "status": 401
  }
}
```

**エラー:**
```json
{
  "level": "error",
  "time": "2026-06-08T10:00:00.000Z",
  "requestId": "uuid-v4",
  "msg": "batch execution failed",
  "batch": {
    "batchId": "uuid-v7",
    "triggerType": "scheduled"
  },
  "error": {
    "type": "/problems/internal-server-error",
    "message": "GitHub Advisory API timeout"
  }
}
```

#### マスキング設定

```typescript
const logger = pino({
  redact: [
    'req.headers.authorization',
    'req.headers.cookie',
    '*.lineUserId',
  ]
})
```

**開発規約:** センシティブ情報は必ずオブジェクトフィールドとして渡す。文字列への直接埋め込みは禁止。

```typescript
// ❌ 禁止
logger.info(`LINE通知送信: lineUserId=${lineUserId}`)

// ✅ 推奨
logger.info({ lineUserId }, 'LINE通知送信')
```

---

### CORS 設定

Hono の組み込み CORS ミドルウェア（`hono/cors`）を使用する。

```typescript
// src/middleware/cors.ts
cors({
  origin: process.env.CORS_ORIGIN ?? "http://localhost:3000",
  allowHeaders: ["Authorization", "Content-Type"],
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  exposeHeaders: ["Content-Length"],
  maxAge: 600,
  credentials: true,
})
```

| 設定 | 値 | 理由 |
|---|---|---|
| `origin` | 環境変数 `CORS_ORIGIN` | 環境ごとに許可オリジンを切り替える |
| `allowHeaders` | `Authorization`, `Content-Type` | JWT 認証ヘッダーと JSON ボディに必要 |
| `allowMethods` | `GET`, `POST`, `PUT`, `DELETE`, `OPTIONS` | 全 HTTP メソッドを許可 |
| `credentials` | `true` | ブラウザがクロスオリジンリクエストに認証情報を含めることを許可。API 認証は Bearer トークンで行うため Cookie は使用しないが、Auth.js が Web 側で管理する HTTP-only Cookie との共存のために設定 |
| `maxAge` | `600` | プリフライトリクエストを 10 分キャッシュ |

---

### ディレクトリ構成

```
packages/api/src/
├── index.ts
│
├── domain/                                        # 外部依存ゼロ
│   ├── user/
│   │   ├── entity.ts
│   │   ├── entity.test.ts                         # コロケーション
│   │   └── UserRepository.ts                      # interface
│   ├── vulnerability/
│   │   ├── entity.ts
│   │   ├── entity.test.ts
│   │   └── VulnerabilityRepository.ts
│   ├── batch/
│   │   ├── entity.ts
│   │   ├── entity.test.ts
│   │   └── BatchRepository.ts
│   ├── notification/
│   │   ├── entity.ts
│   │   ├── entity.test.ts
│   │   └── NotificationRepository.ts
│   ├── notificationChannel/
│   │   ├── entity.ts
│   │   ├── entity.test.ts
│   │   └── NotificationChannelRepository.ts
│   └── vulnerabilityConfig/
│       ├── entity.ts
│       ├── entity.test.ts
│       └── VulnerabilityConfigRepository.ts
│
├── usecases/
│   ├── batch/
│   │   ├── runBatchManual.ts
│   │   ├── runBatchManual.test.ts                 # コロケーション
│   │   └── runBatchScheduled.ts
│   ├── user/
│   │   └── registerUser.ts
│   ├── vulnerability/
│   │   └── listVulnerabilities.ts
│   ├── notification/
│   │   └── listNotifications.ts
│   ├── notificationChannel/
│   │   └── createNotificationChannel.ts
│   └── vulnerabilityConfig/
│       └── upsertVulnerabilityConfig.ts
│
├── infrastructure/
│   ├── repositories/                              # ドメインベース
│   │   ├── user/
│   │   │   └── PrismaUserRepository.ts
│   │   ├── vulnerability/
│   │   │   └── PrismaVulnerabilityRepository.ts
│   │   ├── batch/
│   │   │   └── PrismaBatchRepository.ts
│   │   ├── notification/
│   │   │   └── PrismaNotificationRepository.ts
│   │   ├── notificationChannel/
│   │   │   └── PrismaNotificationChannelRepository.ts
│   │   └── vulnerabilityConfig/
│   │       └── PrismaVulnerabilityConfigRepository.ts
│   └── clients/                                   # 技術ベース
│       ├── line/
│       │   ├── NotificationClient.ts              # interface
│       │   └── LineNotificationClient.ts
│       └── github/
│           ├── AdvisoryClient.ts                  # interface
│           └── GithubAdvisoryClient.ts
│
├── lib/
│   └── prisma.ts
│
├── routes/                                        # Hono RPC
│   ├── users.ts
│   ├── users.test.ts                              # コロケーション
│   ├── batches.ts
│   ├── batches.test.ts
│   ├── vulnerabilities.ts
│   ├── notifications.ts
│   ├── notificationChannels.ts
│   └── vulnerabilityConfigs.ts
│
├── middleware/
│   ├── auth.ts
│   └── adminGuard.ts
│
└── schema/                                        # Zodスキーマ（API固有）
    ├── pagination.ts
    └── index.ts
```

**`schema/` と `packages/shared/schema/` の使い分け:**

| 置き場所 | 対象 | 理由 |
|---|---|---|
| `packages/shared/src/schema/` | リクエストボディのバリデーション（POST・PUT） | Web のフォームバリデーションと共有するため |
| `packages/api/src/schema/` | クエリパラメータ等の API 固有のバリデーション | Web では不要なため |

```typescript
// packages/api/src/schema/pagination.ts（API固有）
export const paginationSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
})
```

**依存の方向：**
```
routes → usecases → domain（entity + Repository interface）
                        ↑
              infrastructure（Prisma実装・外部クライアント実装）
```

---

### 未決事項

| 項目 | 内容 |
|---|---|
| LINE チャネル連携 | `lineUserId` の取得・登録フローは実装フェーズで設計 |
| スケジューラ認証 | M2M（Cognito Client Credentials フロー）を採用予定。詳細はインフラ設計フェーズで |
