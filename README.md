# vuln-notifier（WIP）

## 開発環境

### コンテナ構成

| サービス | 役割 |
|---|---|
| `db` | PostgreSQL データベース |
| `workspace` | pnpm の実行環境。起動時に `pnpm install` を行い、node_modules を api/web と共有する |
| `api` | Hono による API サーバー（ポート 3001） |
| `web` | Next.js による フロントエンド（ポート 3000） |

起動順序: `db` → `workspace`（pnpm install 完了）→ `api` → `web`

```bash
docker compose -f docker-compose.dev.yaml up
```

### パッケージの追加

pnpm の store と node_modules はすべて `workspace` コンテナが管理しています。`api`/`web` コンテナは `pnpm dev` でサーバーを起動しますが、パッケージ管理（`pnpm install` / `pnpm add`）は行いません。node_modules は bind mount で `workspace` から共有しているだけのため、パッケージの追加・削除は必ず `workspace` に対して実行します。

```bash
# ルート（api/web 両方で使うもの）
docker compose -f docker-compose.dev.yaml exec workspace pnpm add -w <package>

# api のみ
docker compose -f docker-compose.dev.yaml exec workspace pnpm add --filter api <package>

# web のみ
docker compose -f docker-compose.dev.yaml exec workspace pnpm add --filter web <package>
```

### Lint / Format（Biome）

```bash
# api、webともに Lint と Format を実行
docker compose -f docker-compose.dev.yaml exec workspace pnpm check

# 全api、webともに Lint と Format を実行（自動修正）
docker compose -f docker-compose.dev.yaml exec workspace pnpm check:fix
```

### テスト（Vitest）

Vitest ワークスペース構成で api・web 両パッケージのテストを管理しています。テストランナーはルートにのみインストールされており、`pnpm test` 一つで全パッケージのテストが走ります。

```bash
# 全パッケージのテストを実行
docker compose -f docker-compose.dev.yaml exec workspace pnpm test

# api のみ
docker compose -f docker-compose.dev.yaml exec workspace pnpm exec vitest run --project api

# web のみ
docker compose -f docker-compose.dev.yaml exec workspace pnpm exec vitest run --project web

# ファイル変更を監視して自動再実行（開発中）
docker compose -f docker-compose.dev.yaml exec workspace pnpm test:watch

# カバレッジ計測（packages/*/coverage/index.html に出力）
docker compose -f docker-compose.dev.yaml exec workspace pnpm test:coverage
```

テストファイルは各パッケージの `src/tests/` 以下に配置します。

| パッケージ | 環境 | テストファイルの場所 |
|---|---|---|
| `api` | Node | `packages/api/src/tests/**/*.test.ts` |
| `web` | jsdom | `packages/web/src/tests/**/*.test.{ts,tsx}` |

### Git フック（Lefthook）

`lefthook install` を実行すると `.git/hooks/` 以下にフックが配置されます。

```bash
# ホストで一度だけ実行（初回セットアップ）
lefthook install
```

#### pre-commit

`git commit` 時に staged ファイルに対して自動で Biome の検査が走ります。検査対象は `*.{js,ts,cjs,mjs,d.cts,d.mts,jsx,tsx,json,jsonc}` に一致するファイルのみです。エラーがある場合はコミットが中断されます。自動修正は行いません。

#### pre-push

`git push` 時に全パッケージのテストが走ります。`workspace` コンテナが起動中である必要があります。テストが失敗した場合はプッシュが中断されます。

```bash
# コンテナが停止している場合は先に起動する
docker compose -f docker-compose.dev.yaml up -d workspace
```

## DB設計

### ER図
![ER図を開く](./docs/db/er-diagram.drawio)
