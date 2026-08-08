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
- 各パッケージの共有テストインフラ（モック・ユーティリティ・factory）は `src/testing/` に置く（実利用が2箇所以上になった時点で切り出す。1箇所のみならテストファイルにコロケーション）
- テストデータの生成には `@faker-js/faker` を使う（catalog管理、API・Web共通）。enum等の業務上意味を持つ値は固定値にし、それ以外はfakerで生成。テストで値そのものを検証したい場合はfactoryの引数で上書きする
- `packages/shared/` のテストは Vitest で実行（スキーマのバリデーションルールを単体テスト）

---

### テスト用 DB

#### 方針

- テスト用 DB コンテナを開発用 DB と分離する（データが混ざらない疎結合）
- `.env` ファイルは使用しない。環境変数は docker-compose / GitHub Actions で管理する
- `docker-compose.yaml`（実ファイル参照）に開発用 DB とは別ポートの `db-test` コンテナを追加し、`api` サービスに `TEST_DATABASE_URL` を追加する
- ルートの `package.json` のテストスクリプトで、実行時に `DATABASE_URL` を `TEST_DATABASE_URL` の値へ上書きする。コンテナ内で `pnpm test` を実行するだけでテスト用 DB に切り替わる
- GitHub Actions では `services` として同じ `db-test` イメージを起動し、`DATABASE_URL` をそのサービスに向けた値で `env` に直接渡す

#### テストデータのクリーンアップ

**TRUNCATE CASCADE** を採用する。Prisma のモデル一覧（`Prisma.ModelName`）から対象テーブルを動的に組み立てて `TRUNCATE ... RESTART IDENTITY CASCADE` を発行する方針とする。こうすることで、`schema.prisma` にモデルを追加した際も対象テーブルの一覧を手動更新せずに済み、かつアプリ外のテーブル（拡張機能・手動作成テーブル等）を誤って削除しない。

テスト実行前（`beforeAll`）にマイグレーションを適用し、各テスト後（`afterEach`）にクリーンアップを行う。

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
