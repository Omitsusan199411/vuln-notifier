# vuln-notifier

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
docker compose -f docker-compose.dev.yml up
```

### パッケージの追加

pnpm のstoreと node_modules はすべて `workspace` コンテナが管理しています。`api`/`web` コンテナは `pnpm dev` でサーバーを起動しますが、パッケージ管理（`pnpm install` / `pnpm add`）は行いません。node_modules は bind mount で `workspace` から共有しているだけのため、パッケージの追加・削除は必ず `workspace` に対して実行します。

```bash
# ルート（api/web 両方で使うもの）
docker compose -f docker-compose.dev.yml exec workspace pnpm add -Dw <package>

# api のみ
docker compose -f docker-compose.dev.yml exec workspace pnpm add --filter api <package>

# web のみ
docker compose -f docker-compose.dev.yml exec workspace pnpm add --filter web <package>
```

### Lint / Format（Biome）

```bash
# apiコンテナとwebコンテナに対してLintとFormatを実行
docker compose -f docker-compose.dev.yml exec workspace pnpm check

# apiコンテナとwebコンテナに対してLintとFormatを実行（自動修正）
docker compose -f docker-compose.dev.yml exec workspace pnpm check:fix

# apiコンテナ のみ実行
docker compose -f docker-compose.dev.yml exec workspace pnpm check --filter api

# webコンテナ のみ実行
docker compose -f docker-compose.dev.yml exec workspace pnpm check --filter web
```
