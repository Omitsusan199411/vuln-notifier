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
docker compose -f docker-compose.dev.yaml exec workspace pnpm add -Dw <package>

# api のみ
docker compose -f docker-compose.dev.yaml exec workspace pnpm add --filter api <package>

# web のみ
docker compose -f docker-compose.dev.yaml exec workspace pnpm add --filter web <package>
```

### Lint / Format（Biome）

```bash
# ルート全体に対して Lint と Format を実行
docker compose -f docker-compose.dev.yaml exec workspace pnpm check

# ルート全体に対して Lint と Format を実行（自動修正）
docker compose -f docker-compose.dev.yaml exec workspace pnpm check:fix

# api/web パッケージに対して Lint と Format を実行（turbo 経由）
docker compose -f docker-compose.dev.yaml exec workspace pnpm check:turbo

# api/web パッケージに対して Lint と Format を実行（自動修正・turbo 経由）
docker compose -f docker-compose.dev.yaml exec workspace pnpm check:turbo:fix
```

### pre-commit フック（Lefthook）

`lefthook install` を実行すると `.git/hooks/pre-commit` が配置され、`git commit` 時に staged ファイルに対して自動で Biome の検査が走ります。

```bash
# ホストで一度だけ実行（初回セットアップ）
lefthook install
```

検査対象は `*.{js,ts,cjs,mjs,d.cts,d.mts,jsx,tsx,json,jsonc}` に一致する staged ファイルのみです。エラーがある場合はコミットが中断されます。自動修正は行いません。
