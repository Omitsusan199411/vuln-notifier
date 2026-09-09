# テスト設計

## 目次

- [共通方針](#共通方針)
- [packages/api](#packagesapi)
- [packages/web](#packagesweb)
- [カバレッジ](#カバレッジ)

---

### 共通方針

- E2E テストは対象外。単体・統合・コンポーネントテストで品質を担保する
- テストファイルは対象コードと同じディレクトリにコロケーション（根拠はパッケージごとに異なるため、各セクションを参照）
- 各パッケージの共有テストインフラ（モック・ユーティリティ・factory）は `src/testing/` に置く（実利用が2箇所以上になった時点で切り出す。1箇所のみならテストファイルにコロケーション）
- テストデータの生成には `@faker-js/faker` を使う（catalog管理、API・Web共通）。enum等の業務上意味を持つ値は固定値にし、それ以外はfakerで生成。テストで値そのものを検証したい場合はfactoryの引数で上書きする
- `packages/shared/` のテストは Vitest で実行（スキーマのバリデーションルールを単体テスト）

---

### packages/api

コロケーションの根拠は、DDD/クリーンアーキテクチャにおける機能（bounded context）単位のモジュール分割（`domain/batch/`・`infrastructure/prisma/batch/` 等）。

#### テスト種別

| 種別 | 対象 | ツール |
|---|---|---|
| 単体テスト | 外部依存のないビジネスロジック・バリデーション | Vitest |
| 統合テスト（DB） | DB に依存するリポジトリ実装 | Vitest + テスト用DB |

`test.projects` で単体テスト（`api-unit`）と統合テスト（`api-integration`）を分離する。`include`/`exclude` で対象ファイルを振り分け、DB クリーンアップ（`afterEach`）は `api-integration` の `setupFiles` にのみ適用することで、単体テストが誤って DB に依存しないようにする。

#### テスト用 DB

##### 方針

- テスト用 DB コンテナを開発用 DB と分離する（データが混ざらない疎結合）
- `.env` ファイルは使用しない。環境変数は docker-compose / GitHub Actions で管理する
- `docker-compose.yaml`（実ファイル参照）に開発用 DB とは別ポートの `db-test` コンテナを追加し、`api` サービスに `TEST_DATABASE_URL` を追加する
- アプリ側（`src/lib/prisma.ts`）で Vitest 実行時フラグ（`process.env.VITEST`）を見て、接続先を `DATABASE_URL` から `TEST_DATABASE_URL` に切り替える。コンテナ内で `pnpm test`（Vitest）を実行するだけでテスト用 DB に切り替わる
- GitHub Actions では `services` として同じ `db-test` イメージを起動し、`DATABASE_URL` をそのサービスに向けた値で `env` に直接渡す

##### テストデータのクリーンアップ

**TRUNCATE CASCADE** を採用する。`pg_tables` から `public` スキーマの全テーブルを取得し（`_prisma_migrations` のみ除外）、`TRUNCATE ... RESTART IDENTITY CASCADE` を発行する方針とする。こうすることで、`schema.prisma` にモデルを追加した際も対象テーブルの一覧を手動更新せずに済む。

テスト実行前に Vitest の `globalSetup` でマイグレーションを適用し、各テスト後（`afterEach`）にクリーンアップを行う。

**TRUNCATE CASCADE を選ぶ理由：**
- `deleteMany` の順次実行より高速（単一 SQL 文）
- `CASCADE` で外部キー制約を自動処理（テーブル順序の管理不要）
- `RESTART IDENTITY` でシーケンスをリセット（テスト間の独立性を保つ）

#### factory

`fishery` を使う。build 専用（DB に依存しない）factory と、DB への書き込み・関連付け（association）を行う factory は、ディレクトリを分ける。同じファイルに共存させると、ドメイン層のテストが build 専用 factory だけを import したつもりでも、同じファイルにある Prisma クライアントの import が一緒に読み込まれてしまうため。

- `src/testing/factories/*.ts`: build 専用。`onCreate` を持たず、Prisma に依存しない。ドメイン層のテストはここだけを import する
- `src/testing/factories/persisted/*.ts`: `onCreate` で実際に DB へ保存する。同名の build 専用 factory がある場合は、デフォルト値を重複させないよう `build()` を呼んで再利用する（例: `persisted/batch.ts` の `batchFactory` は `../batch.js` の `newBatchPropsFactory.build()` を呼ぶ）

---

### packages/web

コロケーションの根拠は bulletproof-react に準拠（Reactアプリ向けの構成パターン）。

#### テスト種別

| 種別 | 対象 | ツール |
|---|---|---|
| 統合テスト | API エンドポイント（モック） | Vitest + MSW |
| コンポーネントテスト | フォーム・UI コンポーネント | Vitest + Testing Library |

---

### カバレッジ

- 目標値: **60%**（`vitest.config.ts` の `coverage.thresholds` で設定）
- 計測ツール: Vitest 組み込みのカバレッジ機能
