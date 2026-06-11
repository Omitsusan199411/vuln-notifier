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

**パイプライン:**

```
① テスト実行（Vitest）
② コンテナイメージのビルド
③ ECR へ push
④ prisma migrate deploy（DB マイグレーション）
⑤ ECS サービスの更新（新しいイメージでデプロイ）
```

**AWS 認証:** OIDC を使用。GitHub Secrets に AWS アクセスキーを保存せず、IAM ロールで一時的な認証情報を取得する。

---

### 環境変数管理

全ての環境変数は **GitHub Secrets** で管理する。

| 変数 | 説明 |
|---|---|
| `DATABASE_URL` | RDS の接続情報 |
| `COGNITO_CLIENT_ID` | Cognito アプリクライアント ID |
| `COGNITO_CLIENT_SECRET` | Cognito アプリクライアントシークレット |
| `COGNITO_ISSUER` | Cognito ユーザープール URL |
| `LINE_CHANNEL_ACCESS_TOKEN` | LINE Messaging API トークン |
| `API_URL` | Web から API への接続先 URL |
