# テスト設計

## 目次

- [方針](#方針)
- [テスト用 DB](#テスト用-db)
- [テスト種別](#テスト種別)
- [カバレッジ](#カバレッジ)

---

### 方針

- E2E テストは対象外。単体・統合・コンポーネントテストで品質を担保する
- テストファイルは対象コードと同じディレクトリにコロケーション（bulletproof-react に準拠）
- Web の共有テストインフラ（モック・ユーティリティ）は `src/testing/` に置く
- `packages/shared/` のテストは Vitest で実行（スキーマのバリデーションルールを単体テスト）

---

### テスト用 DB

#### 方針

- テスト用 DB コンテナを開発用 DB と分離する（データが混ざらない疎結合）
- `.env` ファイルは使用しない。環境変数は docker-compose / GitHub Actions で管理する
- `docker-compose.dev.yaml` に `db-test` コンテナを追加し、`api` サービスに `TEST_DATABASE_URL` を追加する

```yaml
# docker-compose.dev.yaml に追加・変更
db-test:
  image: postgres:18.1
  environment:
    POSTGRES_USER: vuln
    POSTGRES_PASSWORD: password
    POSTGRES_DB: vuln_test
  ports:
    - "5433:5432"  # 開発用DB（5480）と分ける

api:
  environment:
    DATABASE_URL: postgresql://vuln:password@db:5432/vuln_development
    TEST_DATABASE_URL: postgresql://vuln:password@db-test:5432/vuln_test
```

ルートの `package.json` のテストスクリプトで `DATABASE_URL` を上書きする：

```json
"test": "DATABASE_URL=$TEST_DATABASE_URL vitest run"
```

コンテナ内で `pnpm test` を実行するだけでテスト用 DB に切り替わる。

**GitHub Actions:**

```yaml
jobs:
  test:
    services:
      db-test:
        image: postgres:18.1
        env:
          POSTGRES_USER: vuln
          POSTGRES_PASSWORD: password
          POSTGRES_DB: vuln_test
        ports:
          - 5432:5432
    env:
      DATABASE_URL: postgresql://vuln:password@localhost:5432/vuln_test
    steps:
      - run: pnpm test
```

#### テストデータのクリーンアップ

**TRUNCATE CASCADE** を採用する。

```typescript
// packages/api/src/tests/helpers/cleanDatabase.ts
import { Prisma, PrismaClient } from '@prisma/client'

export async function cleanDatabase(prisma: PrismaClient) {
  // Prisma が管理するモデルのみを対象にする
  // → アプリ外のテーブル（拡張機能・手動作成テーブル等）を誤って削除しない
  // → schema.prisma にモデルを追加すれば自動で対応される
  const modelNames = Object.values(Prisma.ModelName)
  const tableNames = modelNames.map(name => `"${name}"`).join(', ')

  await prisma.$executeRawUnsafe(
    `TRUNCATE TABLE ${tableNames} RESTART IDENTITY CASCADE`
  )
}
```

```typescript
// vitest.setup.ts
import { cleanDatabase } from './helpers/cleanDatabase'

beforeAll(async () => {
  await exec('prisma migrate deploy')  // マイグレーション適用
})

afterEach(async () => {
  await cleanDatabase(prisma)  // 各テスト後にクリーンアップ
})
```

**TRUNCATE CASCADE を選ぶ理由：**
- `deleteMany` の順次実行より高速（単一 SQL 文）
- `CASCADE` で外部キー制約を自動処理（テーブル順序の管理不要）
- `RESTART IDENTITY` でシーケンスをリセット（テスト間の独立性を保つ）

---

### テスト種別

| 種別 | 対象 | ツール |
|---|---|---|
| 単体テスト | 外部依存のないビジネスロジック・バリデーション | Vitest |
| 統合テスト | API エンドポイント・外部 API 連携 | Vitest + MSW |
| コンポーネントテスト | フォーム・UI コンポーネント | Vitest + Testing Library |

---

### カバレッジ

- 目標値: **75%**（Google 推奨）
- 計測ツール: Vitest 組み込みのカバレッジ機能
