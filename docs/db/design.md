# DB 設計

## 目次

- [マイグレーション戦略](#マイグレーション戦略)
- [シードデータ](#シードデータ)

---

### マイグレーション戦略

#### 実行タイミング

CI/CD パイプラインの中で自動実行する。

```
① prisma migrate deploy  ← DB スキーマを更新
② アプリをデプロイ        ← 新しいスキーマに対応したアプリを起動
```

#### 失敗時の対処

マイグレーション失敗時はデプロイを中断する。アプリは旧バージョンのまま動き続けるため、原因を調査・修正してから再デプロイする。

#### 開発環境

`prisma migrate dev` を手動実行する。スキーマ変更のたびに開発者が明示的に実行し、マイグレーションファイルを生成する。

| コマンド | 用途 |
|---|---|
| `prisma migrate dev` | 開発時：マイグレーションファイル生成 + ローカル DB 適用 |
| `prisma migrate deploy` | 本番・stg：未適用のマイグレーションを DB に適用 |

#### 複数環境での動作

各環境の DB が `_prisma_migrations` テーブルで適用済みマイグレーションを独立して管理する。`DATABASE_URL` 環境変数で接続先を切り替えるだけでよく、アプリ側のコード変更は不要。

---

### シードデータ

#### 実行タイミング

CI/CD パイプラインで `prisma migrate deploy` の後に `prisma db seed` を実行する（本番環境のみ）。

開発環境では `prisma db seed` を手動実行する。

#### Ecosystem シード

対応エコシステムを全て投入する。

| name | 説明 |
|---|---|
| `npm` | JavaScript / TypeScript |
| `pip` | Python |
| `cargo` | Rust |
| `maven` | Java |
| `rubygems` | Ruby |
| `nuget` | .NET |
| `go` | Go |
| `composer` | PHP |
