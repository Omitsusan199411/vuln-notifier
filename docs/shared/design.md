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
| Zod スキーマ・TypeScript 型 | `src/schema/` | API・Web共通の入力契約を手書きで定義（予定） |

**なぜ共有するか:**
- API とフロントでバリデーションルールの不整合を防ぐ
- 将来モバイルアプリが追加されても同じスキーマ・型を使える
- Hono RPC は型安全なリクエストを保証するが、フォームのリアルタイムバリデーションには Zod スキーマが別途必要

ドメインエンティティは Prisma schema（DBの構造）から独立した、独自の型（class）として `packages/api` の `domain/` 配下に手書きで定義する方針であり、`@repo/shared` は Prisma 由来の自動生成型を持たない。`@repo/shared` は、API・Web共通の入力契約（リクエストボディのバリデーション）を手書きの Zod スキーマとして置く場所として使う（詳細は [`docs/api/design.md`](../api/design.md) を参照）。

---

### ディレクトリ構成

```
packages/shared/
├── src/
│   └── index.ts            # 現時点では空。API・Web共通のZodスキーマを置く予定
├── package.json
└── tsconfig.json
```

**スキーマの置き場所の使い分け:**

| スキーマ | 場所 |
|---|---|
| API・Web 両方で使う | `packages/shared/src/schema/`（手書き） |
| API のみ | `packages/api/src/schema/` |
| Web のみ | `packages/web/src/features/[feature]/schema.ts` |

---

### 使い方

現時点では`packages/shared/src/`は空で、まだ利用箇所はない。今後、API・Web共通の入力契約（リクエストボディのバリデーション）を`packages/shared/src/schema/`に手書きのZodスキーマとして追加し、API・Webの双方がそれを`@repo/shared`からimportして使う予定。ドメインエンティティ自体は`packages/api`の`domain/`配下に独立したclassとして定義するため、`@repo/shared`からimportする対象にはならない。
