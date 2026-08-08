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

#### 開発用ダミーデータ

`Ecosystem`以外の全テーブル（`User`・`Batch`・`Vulnerability`等）向けに、動作確認しやすくするためのダミーデータを、`prisma db seed`とは**独立したコマンド**（例: `pnpm seed:dev`）で投入する。

**なぜ`prisma db seed`と分けるか：** `prisma db seed`は本番でも自動実行されるため、同じコマンド内で`NODE_ENV`分岐に頼ると、設定ミスやロジックのバグで本番にダミーデータが混入するリスクがある。コマンド自体を分けることで、本番の実行経路には物理的に含まれないようにする。

**投入順序：** 外部キー制約があるため、`Ecosystem` → `User` → `Batch` → `Vulnerability` → `NotificationChannel` → `Notification`の順に、前段で実際に作成されたレコードのIDを使って投入する。

**値の生成：** 業務上の意味を持つ値（enum等）は固定値、それ以外は`@faker-js/faker`で生成する（`packages/api/src/testing/factories/`の方針と同様）。
