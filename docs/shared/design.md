# 共有パッケージ設計

## 目次

- [概要](#概要)
- [ディレクトリ構成](#ディレクトリ構成)
- [使い方](#使い方)

---

### 概要

`packages/shared/` は全 packages で共有するコードを置くパッケージです。

| 用途 | 場所 | 説明 |
|---|---|---|
| Zod スキーマ・TypeScript 型 | `src/generated/` | `prisma-zod-generator` が自動生成 |

**なぜ共有するか:**
- API とフロントでバリデーションルールの不整合を防ぐ
- 将来モバイルアプリが追加されても同じスキーマ・型を使える
- Hono RPC は型安全なリクエストを保証するが、フォームのリアルタイムバリデーションには Zod スキーマが別途必要

**自動生成を採用する理由:**
- `prisma-zod-generator` が `prisma generate` 実行時に Prisma スキーマから Zod スキーマと TypeScript 型を自動生成する
- Prisma スキーマとの手動同期が不要
- モデル・enum の追加・変更が即座に反映される

**`zod-prisma-types` ではなく `prisma-zod-generator` を使う理由:**
- 当初 `zod-prisma-types` を使用していたが、公式サポートが Prisma 4.x〜6.x までで、このプロジェクトが使う Prisma 7 系には非対応（メンテナンスも縮小モードで、後継として `prisma-zod-generator` への移行を公式に推奨している）
- 実際に Prisma 7 の新しいクライアント生成方式（`generator client { provider = "prisma-client" }`、カスタム `output`）と組み合わせると、生成コードの `import` が壊れる不具合が発生した
- `prisma-zod-generator` は Prisma 7 に正式対応しており、同種の不具合の報告も修正済みだったため乗り換えた

---

### ディレクトリ構成

```
packages/shared/
├── src/
│   ├── generated/          # prisma-zod-generator が自動生成（prisma generate で更新）
│   │   └── schemas.ts
│   └── index.ts            # generated から必要なものを re-export
├── package.json
└── tsconfig.json
```

**生成の仕組み:**

`packages/api/prisma/schema.prisma` の `generator zod` ブロックで `provider = "prisma-zod-generator"` を指定し、詳細設定は `packages/api/prisma/zod-generator.config.json` に切り出している。主な設定意図:

| 設定 | 意図 |
|---|---|
| モデル・enumの素のZodスキーマのみ生成 | Prismaの`create`/`update`/`where`等の操作用スキーマ（CRUD関連の大量のファイル）は生成しない。APIへのリクエスト検証は`packages/api/src/schema/`等の手書きZodスキーマで行う方針のため、不要 |
| Decimalフィールドを`z.number()`として扱う | `Prisma.Decimal`のインスタンスとして扱うと、Prisma Clientの生成物（別パッケージ`packages/api/src/generated/prisma`）を跨いだ`import`が必要になり、Prisma 7との組み合わせで不具合が起きたため |
| 単一ファイルに集約 | 運用のしやすさのため |

**スキーマの置き場所の使い分け:**

| スキーマ | 場所 |
|---|---|
| API・Web 両方で使う | `packages/shared/src/generated/`（自動生成） |
| API のみ | `packages/api/src/schema/` |
| Web のみ | `packages/web/src/features/[feature]/schema.ts` |

---

### 使い方

API・Webいずれのクライアントも、Zodスキーマ・TypeScript型は`@repo/shared`から直接importする（例: `VulnerabilityConfigSchema`、`Severity`）。
