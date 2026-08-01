# ビルド戦略設計

## 概要

このプロジェクトは3つのパッケージで構成されるモノレポです。

| パッケージ | 開発 | 本番ビルド | 本番起動 |
|---|---|---|---|
| `packages/shared` | ビルド不要 | `tsc` → `dist/` | - |
| `packages/api` | `tsx watch` | `tsc` → `dist/` | `node dist/index.js` |
| `packages/web` | `next dev` | `next build` | `next start` |

---

## packages/shared

### 役割

Prisma から自動生成された Zod スキーマを提供するパッケージです。api・web の両方から参照されます。

### package.json

`exports` フィールドに3種類の条件（`source` / `types` / `import`）を定義し、呼び出し元の実行環境ごとに参照先を切り替える（詳細は実ファイル `packages/shared/package.json` を参照）。

**exports の条件分岐**

| condition | 使われる場面 | 指す先 |
|---|---|---|
| `source` | tsx（開発時） | `.ts` ファイル |
| `types` | TypeScript 型チェック（CI環境） | `.ts` ファイル |
| `import` | Node.js（本番時） | `.js` ファイル |

exports の照合は「実行者が持つ条件リスト」と上から順に一致したものを採用します。

**条件リストとは**

`import '@repo/shared'` を解決する時、実行者が「自分はどの条件に対応しているか」を示すラベルの集合です。package.json の exports の条件キーとこのリストを照合し、最初に一致したファイルパスを採用します。

実行者とは `import '@repo/shared'` を解決するプログラム本体のことです。

| 実行者 | 場面 |
|---|---|
| tsx | `turbo dev`（開発サーバー起動時） |
| Node.js（素） | `node dist/index.js`（本番起動時） |
| TypeScript（tsc） | `tsc --noEmit`（型チェック時）/ IDE の型補完 |
| webpack | `next dev` / `next build`（Next.js ビルド時） |

**条件リストがどう作られるか**

```
Node.js のデフォルト条件リスト（組み込み）:
  ['node', 'import', 'require', 'default']

tsx 起動時: Node.js を起動する際に --conditions source を渡すことで条件リストをカスタムで追加する（tsx の内部実装）
  ['source', 'node', 'import', 'require', 'default']  ← source が追加される

TypeScript（tsc --noEmit）: TypeScript が型解決時に types を自動で追加
  ['types', 'import', 'require', 'default']  ← types が追加される

webpack（next dev）: next.config.ts の conditionNames で手動追加
  config.resolve.conditionNames = ['source', ...config.resolve.conditionNames]
  ['source', 'browser', 'import', 'require', 'default']  ← source が追加される
```

**照合の結果**

```
tsx（開発）:             source が先頭 → ./src/index.ts を採用
TypeScript（型チェック）: types が先頭  → ./src/index.ts を採用
Node.js 素（本番）:      source/types なし → import にフォールバック → ./dist/index.js を採用
```

> **注意**: tsx が `source` 条件を自動で認識するかは tsx 4.21.0 の実装依存です。動作しない場合は `dev` スクリプトを `tsx --conditions source watch src/index.ts` に変更してください。`--conditions` は Node.js 標準オプションで、tsx はそれをそのまま Node.js に渡します。

### tsconfig.json

`module`/`moduleResolution` は `NodeNext` を採用する（詳細は実ファイル `packages/shared/tsconfig.json` を参照）。`module: NodeNext` では import 指定子にコンパイル後の拡張子（`.js`）を書く必要があるため、ソースは `.ts` でも import 文は `.js` で書く。

### src/index.ts（バレルファイル）

`src/index.ts` は shared の公開 API の窓口であり、`generated/` 配下を re-export する。外部（api・web）は常に `@repo/shared` からのみ import する方針とし、`@repo/shared/src/generated/...` のような内部パスへの直接 import は禁止する。直接パスを import すると、shared の内部構造を変更した時に api・web 側も修正が必要になり、バレルファイルを設けた意味が失われるため。

shared に新しいファイルを追加した場合は、`src/index.ts` に re-export を1行追加する。外部からの import パス（`@repo/shared`）自体は変わらない。

---

## packages/api

### 役割

Hono による Node.js API サーバー

### 開発環境

```bash
tsx watch src/index.ts
```

tsx が Node.js の module loader に esbuild のフックを登録し、`.ts` ファイルをメモリ上でトランスパイルして即実行します。`dist/` は生成されません。ファイル変更時に自動リロードします。

### 本番環境

```bash
tsc        # TypeScript を dist/ にコンパイル
node dist/index.js  # 起動
```

### tsconfig.json

（詳細は実ファイル `packages/api/tsconfig.json` を参照）

project references は不要です。Turborepo が shared → api のビルド順序を保証します。

`rootDir` を明示しているのは、`@repo/shared` を参照することで `tsc` の rootDir 自動推論が `packages/shared/src` まで広がり、`dist/` の出力構造が崩れるのを防ぐためです。

### package.json

本番起動は `node dist/index.js` のため tsx は不要です。tsx は開発時のみ使用するため `devDependencies` に配置します。

> **注意**: 型チェックscriptの名前は api が `typeCheck`、web が `type:check` と表記が揺れています（後述）。統一する場合は別途対応してください。

---

## packages/web

### 役割

Next.js によるフロントエンド

### shared の扱い

web は tsc でビルドしません。`next build` が webpack を通じて TypeScript を直接処理します。tsc は型チェック専用（`tsc --noEmit`）として使います。

### next.config.ts

`transpilePackages` で「@repo/shared だけは TypeScript としてコンパイルしてください」と指示します。

`webpack.conditionNames` に `source` を追加することで、`next dev` 時に webpack が shared の `source` 条件（`./src/index.ts`）を認識できます。これがないと webpack は `import` 条件（`./dist/index.js`）を探しますが、開発時は `dist/` が存在しないためエラーになります。

> **注意**: `source` 条件は tsx・Vite・webpack などのツールが認識する慣習的な条件名です。Next.js 16 での動作は実装後に確認が必要です。

### package.json

（詳細は実ファイル `packages/web/package.json` を参照）

---

## Turborepo との統合

`turbo.json` の `"dependsOn": ["^build"]` により、shared のビルドが api・web より先に実行されます。

```
turbo run build
  ① shared の build を実行（tsc → dist/）
  ② api の build を実行（shared/dist が存在する状態）
  ③ web の build を実行（next build、shared/dist/.js を webpack が読む）
```

```
turbo dev
  ① api の dev を起動（tsx watch、shared の dist/ は不要）
  ② web の dev を起動（next dev）
```

---

## CI フロー

### test ジョブ

```
1. pnpm install
2. prisma generate        ← shared/src/generated を生成
3. tsc --noEmit           ← shared のビルド不要（types → .ts を直読み）
4. pnpm test:coverage     ← tsx で実行
```

### build ジョブ

```
1. pnpm install
2. prisma generate
3. turbo run build        ← shared → api の順でビルド
```

---

## 本番デプロイフロー（api）

### pnpm deploy によるスタンドアロン化

```bash
pnpm --filter api deploy /prod/api
```

`/prod/api/` の中身：

```
/prod/api/
  dist/          ← tsc の出力（api の .js）
  node_modules/
    @repo/shared/
      src/       ← .ts ソース（types 参照用）
      dist/      ← .js ファイル（本番実行用）
    hono/
    ...
  package.json
```

### Dockerfile（api）

マルチステージビルドを採用する。ビルドステージ（`node:24-alpine`）で依存関係のインストール・`prisma generate`・`turbo run build`・`pnpm deploy`によるスタンドアロン化までを行い、実行ステージでは前段の`/prod/api`の中身だけをコピーして`node dist/index.js`で起動する。ビルド専用の依存関係やソース全体を実行イメージに含めないため、イメージサイズを抑えられる。
