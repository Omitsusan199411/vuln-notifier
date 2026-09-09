# インフラ設計

## 目次

- [構成概要](#構成概要)
- [デプロイ先](#デプロイ先)
- [CI/CD](#cicd)
- [環境変数管理](#環境変数管理)

---

### 構成概要

2つの構成案を検討する。

#### 第一案（AWS 統一）

```
GitHub
  ↓ push
GitHub Actions（CI/CD）
  ↓ ビルド・テスト・ECR push
Amazon ECR（コンテナレジストリ）
  ↓ デプロイ
ECS Fargate（API）    ECS Fargate（Web）
  ↓                       ↓
Amazon RDS（PostgreSQL）
```

| サービス | リソース | 月額概算 |
|---|---|---|
| API | ECS Fargate | 約 1,700円 |
| Web | ECS Fargate | 約 1,700円 |
| DB | Amazon RDS | 約 2,400円 |
| **合計** | | **約 5,800円** |

---

#### 第二案（コスト最適化）

```
GitHub
  ↓ push
GitHub Actions（CI/CD）
  ↓ デプロイ
AWS Lambda（API）    Vercel（Web）
        ↓                ↓
    Neon（Vercel Postgres / PostgreSQL）
```

| サービス | リソース | 月額概算 |
|---|---|---|
| API | AWS Lambda | ほぼ無料 |
| Web | Vercel 無料枠 | 無料 |
| DB | Neon（Vercel Postgres）無料枠 | 無料 |
| **合計** | | **~0円** |

**注意事項:**
- Lambda のタイムアウトは15分。バッチ処理が15分以内に収まることを確認する必要がある
- Vercel・Neon は AWS 外のサービス

---

### デプロイ先

| サービス | 第一案 | 第二案 |
|---|---|---|
| API（Hono） | ECS Fargate | AWS Lambda |
| Web（Next.js） | ECS Fargate | Vercel |
| DB（PostgreSQL） | Amazon RDS | Neon（Vercel Postgres） |
| コンテナレジストリ | Amazon ECR | 不要（Lambda は ZIP デプロイ） |

---

### CI/CD

**ツール:** GitHub Actions

**現状の実装範囲（`.github/workflows/ci.yaml`）:**

```
① audit（pnpm audit）
② lint（Biome）
③ test（Vitest。prisma migrate deploy 後にテスト実行）
④ build
```

デプロイに関するジョブ（コンテナビルド以降）は未実装。

**将来計画（未実装）:**

```
⑤ コンテナイメージのビルド
⑥ ECR へ push
⑦ prisma migrate deploy（DB マイグレーション）
⑧ ECS サービスの更新（新しいイメージでデプロイ）
```

**AWS 認証（将来計画）:** OIDC を使用。GitHub Secrets に AWS アクセスキーを保存せず、IAM ロールで一時的な認証情報を取得する。

---

### 環境変数管理

`.env` ファイルは使用しない。環境ごとに以下の方法で管理する。

#### ローカル開発

`docker-compose.yaml` の `environment` に直接記述する。

#### テスト（ローカル）

`docker-compose.yaml` で `DATABASE_URL`（開発用 DB）と `TEST_DATABASE_URL`（テスト用 DB）を両方注入する。接続先の切り替えは `src/lib/prisma.ts` が `process.env.VITEST` の有無で判定し、Vitest 実行時のみ `TEST_DATABASE_URL` を使用する。テスト用 DB のマイグレーションリセットは `vitest.global-setup.ts` が `DATABASE_URL` を `TEST_DATABASE_URL` の値で上書きした環境で `prisma migrate reset` を実行することで行う。また、コンテナ起動時には `docker-entrypoint.sh` が開発用・テスト用の両 DB に対して `prisma migrate deploy` を実行する（詳細はテスト設計参照）。

#### テスト（GitHub Actions）

GitHub Actions の `env` で `DATABASE_URL` を直接渡す（詳細はテスト設計参照）。

#### 本番（クラウド）

**GitHub Secrets** で管理し、ECS タスク定義またはGitHub Actionsのワークフローで注入する。

| 変数 | 説明 |
|---|---|
| `DATABASE_URL` | RDS の接続情報 |
| `COGNITO_CLIENT_ID` | Cognito アプリクライアント ID |
| `COGNITO_CLIENT_SECRET` | Cognito アプリクライアントシークレット |
| `COGNITO_ISSUER` | Cognito ユーザープール URL |
| `LINE_CHANNEL_ACCESS_TOKEN` | LINE Messaging API トークン |
| `NEXT_PUBLIC_API_URL` | Web から API への接続先 URL |
