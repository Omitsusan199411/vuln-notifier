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
| Zod スキーマ・TypeScript 型 | `src/generated/` | `zod-prisma-types` が自動生成 |

**なぜ共有するか:**
- API とフロントでバリデーションルールの不整合を防ぐ
- 将来モバイルアプリが追加されても同じスキーマ・型を使える
- Hono RPC は型安全なリクエストを保証するが、フォームのリアルタイムバリデーションには Zod スキーマが別途必要

**自動生成を採用する理由:**
- `zod-prisma-types` が `prisma generate` 実行時に Prisma スキーマから Zod スキーマと TypeScript 型を自動生成する
- Prisma スキーマとの手動同期が不要
- モデル・enum の追加・変更が即座に反映される

---

### ディレクトリ構成

```
packages/shared/
├── src/
│   ├── generated/          # zod-prisma-types が自動生成（prisma generate で更新）
│   │   └── index.ts
│   └── index.ts            # generated から必要なものを re-export
├── package.json
└── tsconfig.json
```

**生成の仕組み:**

```prisma
# packages/api/prisma/schema.prisma に追加
generator zod {
  provider = "zod-prisma-types"
  output   = "../../shared/src/generated"
}
```

`prisma generate` を実行すると `packages/shared/src/generated/` に以下が自動生成される：

```typescript
// 自動生成される型の例
export const SeveritySchema = z.enum(['unknown', 'low', 'medium', 'high', 'critical'])
export type Severity = z.infer<typeof SeveritySchema>

export const VulnerabilityConfigSchema = z.object({
  minSeverity: SeveritySchema,
  minCvssScore: z.number(),
  ...
})
```

**スキーマの置き場所の使い分け:**

| スキーマ | 場所 |
|---|---|
| API・Web 両方で使う | `packages/shared/src/generated/`（自動生成） |
| API のみ | `packages/api/src/schema/` |
| Web のみ | `packages/web/src/features/[feature]/schema.ts` |

---

### 使い方

```typescript
// Zod スキーマ・TypeScript 型（全クライアント共通）
import { VulnerabilityConfigSchema, Severity } from '@repo/shared'
```
