# API 設計

## 目次

- [権限レベル定義](#権限レベル定義)
- [認証](#認証)
- [エンドポイント一覧](#エンドポイント一覧)
- [GitHub Advisory連携](#github-advisory連携)
- [LLM連携](#llm連携)
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
| `GET` | `/batches/:batch_id/vulnerabilities` | バッチで取得した脆弱性一覧取得 | 一般ユーザー / 管理者 |

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
| `GET` | `/vulnerabilities/:vulnerability_id` | 脆弱性詳細取得 | 一般ユーザー / 管理者 |
| `PUT` | `/vulnerabilities/:vulnerability_id` | 脆弱性更新 | 管理者 |
| `DELETE` | `/vulnerabilities/:vulnerability_id` | 脆弱性削除 | 管理者 |

**備考:**
- 脆弱性の作成は `POST /batches` のハンドラー内で行うため、作成エンドポイントは不要。
- ユーザーの脆弱性は通知履歴（`GET /users/:user_id/notification-channels/:channel_id/notifications`）経由で参照する。
- `GET /vulnerabilities` はカーソルページネーション対応（`?cursor=<nextCursor>&limit=20`）。
- 既存のアドバイザリ（`Vulnerability.sourceAdvisoryId`）でも、取得元の `updated_at`（`Vulnerability.sourceUpdatedAt`）が進んでいればレコードを更新し、`llmSummary` を再生成する。

---

#### Notifications

| メソッド | パス | 説明 | 権限 |
|---|---|---|---|
| `GET` | `/notifications` | 全ユーザーの通知履歴一覧取得 | 管理者 |
| `GET` | `/users/:user_id/notification-channels/:channel_id/notifications` | ユーザーの通知履歴一覧取得 | 一般ユーザー / 管理者 |
| `GET` | `/users/:user_id/notification-channels/:channel_id/notifications/:notification_id` | 通知履歴詳細取得 | 一般ユーザー / 管理者 |

**備考:**
- 通知の作成は `POST /batches` のハンドラー内で行うため、作成エンドポイントは不要。
- `GET /notifications`・`GET /users/:user_id/notification-channels/:channel_id/notifications` はカーソルページネーション対応（`?cursor=<nextCursor>&limit=20`）。
- 脆弱性が更新（`sourceUpdatedAt` の変化）された場合、既に通知済みのユーザーにも再通知する。

---

### GitHub Advisory連携

| 項目 | 内容 |
|---|---|
| 使用API | GitHub Advisory REST API（`GET /advisories`） |
| 認証 | 不要（未認証で呼び出し）。ローカル・本番で同一のクライアントを使用し、Fake実装は用意しない |
| リトライ | 固定間隔・最大1回リトライ、計2回試行、各1秒間隔。対象は fetch 自体の失敗・5xx レスポンスのみ。4xx（レート制限含む）とバリデーション失敗はリトライしない（待っても解消しない性質のエラーのため） |
| テスト | `GithubAdvisoryClient`自体を使い、内部の`fetch`をモック化する |

```
usecases/ports/
├── SecurityAdvisoriesProvider.ts       # interface（ベンダー非依存。将来GitHub以外のAdvisory取得元が増える可能性があるため）
└── SecurityAdvisoriesProvider.types.ts # 入出力の型（SecurityAdvisoriesSearchParams・ConvertedVulnerability）

infrastructure/clients/github/
├── GithubAdvisoryClient.ts      # 実装
├── GithubAdvisoryClient.type.ts # GitHub固有の生レスポンス型（GithubAdvisorySchemaから導出）
└── GithubAdvisorySchema.ts      # GitHub固有の生レスポンスを検証するZodスキーマ
```

**インターフェース設計方針:**

- ポートのインターフェース名は`AdvisoryClient`ではなく`SecurityAdvisoriesProvider`とする。usecase層が必要としているのは「脆弱性データを取得する能力」であり、「どう取得するか（HTTPクライアントとして呼ぶ）」という実装都合の言葉（Client）をポートの名前に持ち込まない。一方、実装クラス（`GithubAdvisoryClient`）は実際にHTTP通信を行うクラスなので`Client`という言葉が適切。
- `SecurityAdvisoriesProvider`インターフェースは、GitHub固有の情報（クエリパラメータ名・レスポンスのJSON構造）を一切含まない。入力（検索条件）・出力（脆弱性データ）とも、このアプリの業務が必要とする形で定義する。
- 外部APIとの境界では、レスポンスを`unknown`として受け取り、ランタイムバリデーション（Zod）を通してから初めて信頼できる型として扱う。TypeScriptの型はコンパイル時のみのチェックであり、実行時に外部APIが実際にどんなJSONを返すかは保証されないため。
- ベンダー固有のバリデーションスキーマ・レスポンス構造・フィルタリング方法（例: GitHubの`severity`は「以上」の閾値指定に対応していないため、取得後にクライアント内で絞り込む）は、`GithubAdvisoryClient`の内部に完全に閉じ込める。`SecurityAdvisoriesProvider`インターフェースにもusecase層にも漏らさない。
- この方針により、将来GitHub以外の脆弱性データベース（例: OSV）を追加する場合も、`SecurityAdvisoriesProvider`インターフェース自体は変更せず、`clients/osv/OsvAdvisoryClient.ts`のように、OSV固有のバリデーション・変換ロジックを持つ実装を追加するだけで済む。
- `Vulnerability`モデルの識別子・生レスポンス関連フィールドも同じ理由でベンダー中立な命名にしている（`ghsaId`ではなく`sourceAdvisoryId`＋`advisorySource`、`advisoryUpdatedAt`ではなく`sourceUpdatedAt`、`githubAdvisoryResponse`ではなく`sourceResponse`）。「advisory」という言葉自体はGitHub固有ではなく業界共通の概念（ベンダーが公開する脆弱性文書）なので残すが、「GitHub」「GHSA」のようなベンダー固有語は含めない。

**データフロー（例）:**

```
GitHub Advisory REST API                    OSV API（将来追加する場合）
        │                                           │
        ▼                                           ▼
     fetch()                                     fetch()
        │                                           │
        ▼                                           ▼
     unknown                                     unknown
        │                                           │
        ▼                                           ▼
GithubAdvisorySchema.parse()          OsvAdvisorySchema.parse()
   （Zodでランタイム検証）                  （Zodでランタイム検証）
        │                                           │
        ▼                                           ▼
  検証済みのGitHub固有の型              検証済みのOSV固有の型
        │                                           │
        ▼                                           ▼
  GithubAdvisoryClient内で              OsvAdvisoryClient内で
  ConvertedVulnerabilityへ変換          ConvertedVulnerabilityへ変換
        │                                           │
        └───────────────────┬───────────────────────┘
                             ▼
              ConvertedVulnerability[]（ベンダー非依存）
                             │
                             ▼
           usecase・ドメイン層（SecurityAdvisoriesProviderインターフェースのみに依存）
```

---

### LLM連携

脆弱性の要約（`Vulnerability.llmSummary`）は、バッチ実行（`POST /batches`）のハンドラー内で、GitHub Advisoryから取得した情報をもとに生成する。

#### 使用サービス

| 項目 | 内容 |
|---|---|
| プロバイダー | Amazon Bedrock |
| モデル | Anthropic Claude Haiku（東京リージョン: `ap-northeast-1`） |
| モデルバージョン | TODO: `BEDROCK_MODEL_ID` 環境変数で指定し、コード変更なしにアップデートできるようにする |
| オーケストレーションツール | 使用しない（LangChain・LangGraphは不採用） |

**LangChain・LangGraphを採用しない理由:** 要約処理は「1件の脆弱性情報を渡して要約を1回もらう」という単発の呼び出しであり、複数ステップの連鎖（LangChainの得意領域）や、分岐・ループを伴う状態管理（LangGraphの得意領域）を必要としない。単発呼び出しに対してこれらのフレームワークを導入すると、依存が増えるだけでメリットがない。`@aws-sdk/client-bedrock-runtime` を直接呼び出す。

#### 入出力

| 項目 | 内容 |
|---|---|
| 入力 | `Vulnerability.sourceResponse`（GitHub Advisory APIのレスポンスをそのまま渡す。特定フィールドの抽出は行わない） |
| 出力 | プレーンテキストの要約文字列（`llmSummary` は `String?` のため、構造化出力は採用しない） |

#### エラーハンドリング

| 項目 | 内容 |
|---|---|
| リトライ | 固定間隔・最大1回リトライ（計2回試行）。各試行の間隔は1秒 |
| リトライ後も失敗した場合 | `llmSummary` を `null` のまま保存し、バッチ処理は継続する（要約なしで通知を送る） |
| バッチ全体を失敗させるか | させない。LLM要約は付加価値であり、脆弱性通知そのものをブロックする理由にはしない |

#### 並列実行

バッチ内で複数の新規脆弱性を要約する場合、同時実行数は最大3件に制限する。Bedrockのレート制限（スロットリング）を回避しつつ、処理速度を確保するため。運用実績を見ながら調整する。

#### ローカル開発・テスト

| 環境 | 使用するクライアント |
|---|---|
| ローカル開発 | `FakeSummaryClient`（固定文字列を返す） |
| 自動テスト（Vitest） | `FakeSummaryClient` |
| 本番 | `BedrockSummaryClient` |

**理由:** 開発者ごとにAWS認証情報・Bedrockのモデルアクセス許可を用意するコストを避け、CIでもAWS Secretsを増やさずに済むため。本物のBedrockで動作確認したい場合は、環境変数で個別に切り替えられるようにする。

#### 予算管理

Amazon Bedrock自体には、コスト（$）に対するネイティブなハード上限機能は存在しない（AWS Budgetsのアラートは請求データ由来で遅延があり、リアルタイムに呼び出しを止められない）。そのため、アプリケーション層で月間の使用量を自前管理し、呼び出し前に同期的にチェックする方式を採る。

**テーブル設計:** `LlmMonthlyUsage`モデル（`year`・`month`・`inputTokens`・`outputTokens`・`costUsd`を`[year, month]`でユニーク制約、詳細は実ファイル`packages/api/prisma/schema.prisma`を参照）。

**`year`/`month`を個別の`Int`型にする理由:** 月次データを`DATE`型（月初日を格納）で表現する方法も検討したが、「月初日をどう作るか」の実装がタイムゾーン依存になりやすい（ローカルタイムゾーンの`getFullYear()`/`getMonth()`を使うと、UTC変換時に日付が前後にずれ、月をまたぐタイミングで集計が混線するバグを生みやすい）。`year`/`month`を個別の`Int`型にすることで、そもそも「日」を扱わないため、この種のタイムゾーンバグが構造的に発生しない。

**トークン数・コストの取得方法:** 別途トークナイザーは使用しない。BedrockのInvokeModelレスポンスに含まれる`usage.input_tokens`/`usage.output_tokens`の実測値をそのまま加算する。

**更新方法:** Prismaの`upsert`＋`increment`を使い、レコードが無ければ作成・あればDB側でアトミックに加算する（並列実行数3の同時書き込みでも取りこぼしが起きないようにするため）。

**予算チェックの置き場所:** `SummaryClient`の実装（`BedrockSummaryClient`）ではなく、usecase層で`summaryClient.summarize()`を呼ぶ前にチェックする。予算管理はLLM呼び出し手段（Bedrockかどうか）とは独立した関心事であり、`SummaryClient`に混ぜると`FakeSummaryClient`にも同じロジックの重複実装が必要になるほか、「予算超過」と「呼び出し失敗」が戻り値だけで区別できなくなるため。

月間予算額（`MONTHLY_LLM_BUDGET_USD`）: TODO: 具体的な金額を運用しながら決定し、環境変数で設定する。

#### アーキテクチャ

契約（port）はusecase層、実装はinfrastructure層に置く（`usecases/ports/SecurityAdvisoriesProvider.ts`と同じパターン）。

```
usecases/ports/
└── SummaryClient.ts        # interface

infrastructure/clients/llm/
└── BedrockSummaryClient.ts # Bedrock実装（東京リージョン）
```

usecase層は`SummaryClient`インターフェースのみをimportし、`BedrockSummaryClient`は直接importしない。具象の生成はroutes層（composition root）で行う。テストでは`FakeSummaryClient`を注入する。

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
    "url": "/users/abc123/notification-channels/ch456/notifications",
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
    "url": "/users/abc123/notification-channels/ch456/notifications"
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

Pinoの`redact`オプションで、リクエストの認証ヘッダー（`req.headers.authorization`）・Cookie（`req.headers.cookie`）・LINEのユーザーID（`*.lineUserId`、ネストしたどの階層でも一致）をマスクする（実装は`packages/api/src/lib/logger.ts`を参照）。

**開発規約:** センシティブ情報は必ずオブジェクトフィールドとして渡す（`logger.info({ lineUserId }, 'メッセージ')`）。文字列への直接埋め込み（テンプレートリテラルでの埋め込み等）は、`redact`によるマスキングが効かなくなるため禁止。

---

### CORS 設定

Hono の組み込み CORS ミドルウェア（`hono/cors`）を使用する（実装は`packages/api/src/middleware/cors.ts`を参照）。設定意図は以下の通り。

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
│   │   ├── entity.type.ts                         # VulnerabilityProps（独自定義。Prisma schemaとは独立）
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
│   ├── ports/                                     # port = usecaseが外部の技術に要求する契約（interface）
│   │   ├── SecurityAdvisoriesProvider.ts
│   │   ├── SecurityAdvisoriesProvider.types.ts
│   │   ├── NotificationClient.ts
│   │   └── SummaryClient.ts
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
│   └── clients/                                   # 技術ベース（portの実装のみ）
│       ├── line/
│       │   └── LineNotificationClient.ts
│       ├── github/
│       │   ├── GithubAdvisoryClient.ts
│       │   ├── GithubAdvisoryClient.type.ts
│       │   └── GithubAdvisorySchema.ts
│       └── llm/
│           └── BedrockSummaryClient.ts
│
├── lib/
│   ├── prisma.ts
│   └── logger.ts
│
├── testing/                                       # 複数のテストファイルで共有するテスト補助（ヘルパー・factory）
│   └── factories/                                 # 実利用が2箇所以上になった時点で切り出す。テストファイル自体はコロケーション
│       └── vulnerability.ts                       # createVulnerabilityProps・createConvertedVulnerability
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

**型の配置方針:**

ドメインエンティティは、Prisma schema（DBの構造）から独立した、独自の型（class）として`domain/`配下に定義する（王道DDD、Rich Domain Model）。自動生成された型は使わない。DBスキーマの変更がドメイン層・usecase層に伝播しないようにするため。

| 型の種類 | 置き場所 | 理由 |
|---|---|---|
| ドメインエンティティ | `domain/*/entity.ts`に独自のclassとして定義する（Prisma schemaとは独立） | DBスキーマの変更がドメイン層に伝播しないようにするため |
| Repository interface | `domain/` | エンティティに不可分な契約（例: Userはidで検索できる） |
| Client interface（外部API等の技術。= port） | `usecases/ports/` | 特定usecaseが要求する技術的能力。entityの本質ではない |

`@repo/shared`はPrisma由来の自動生成された型を持たない。API・Web共通の入力契約（下記）を手書きのZodスキーマとして置く場所として使う。

**`schema/` と `packages/shared/schema/` の使い分け:**

| 置き場所 | スコープ・意図 | 対象 | 理由 |
|---|---|---|---|
| `packages/shared/src/schema/` | API・Web共通の入力契約 | リクエストボディのバリデーション（POST・PUT） | Web のフォームバリデーションと共有するため |
| `packages/api/src/schema/` | このAPI自身が受け取るリクエストのうち、Web非共有のもの | クエリパラメータ等の API 固有のバリデーション | Web では不要なため |

例: `packages/api/src/schema/pagination.ts`では、`page`（1以上、デフォルト1）・`limit`（1〜100、デフォルト20）をこの層でバリデーションする。

**依存の方向：**
```
routes → usecases（usecase + ports） → domain（entity + Repository interface）
                        ↑
              infrastructure（Prisma実装・port実装）
```

---

### 未決事項

| 項目 | 内容 |
|---|---|
| LINE チャネル連携 | TODO: `lineUserId` の取得・登録フローを設計する |
| スケジューラ認証 | TODO: M2M（Cognito Client Credentials フロー）の詳細をインフラ設計フェーズで設計する |
| LLMモデルバージョン | TODO: `BEDROCK_MODEL_ID` の具体的な値を実装フェーズで決定する |
| 月間LLM予算額 | TODO: `MONTHLY_LLM_BUDGET_USD` の具体的な金額を運用しながら決定する |
