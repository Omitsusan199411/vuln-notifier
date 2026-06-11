# Web 設計

## 目次

- [技術スタック](#技術スタック)
- [ルート構成](#ルート構成)
- [ディレクトリ構成](#ディレクトリ構成)
- [エラーハンドリング](#エラーハンドリング)

---

### 技術スタック

| 用途 | ライブラリ |
|---|---|
| フレームワーク | Next.js（App Router） |
| サーバー状態管理 | TanStack Query |
| クライアント状態管理 | Jotai |
| フォーム | React Hook Form + Zod |
| UI コンポーネント | shadcn/ui |
| API クライアント | Hono RPC |
| 共有スキーマ・型 | `@repo/shared`（`packages/shared/`） |
| テスト | Vitest + Testing Library + MSW |

**データフェッチ方針:**
- 一覧・詳細表示 → Server Components（DB に近い側でフェッチ）
- ボタン・フォーム操作 → Client Components + TanStack Query

---

### ルート構成

```
# 未認証のみ
/auth/signin
/auth/signup

# 認証済み（一般ユーザー・管理者共通）
/dashboard                              ← 脆弱性一覧
/dashboard/notifications                ← 通知履歴
/dashboard/batches                      ← バッチ履歴

# 認証済み・共有詳細ページ（一般ユーザー / 管理者）
/vulnerabilities/:id                    ← 脆弱性詳細
/batches/:id                            ← バッチ詳細
/notifications/:id                      ← 通知詳細

# 認証済み（一般ユーザー・管理者共通）
/settings/vulnerability-configs        ← 取得設定管理
/settings/notification-channels        ← 通知チャネル管理

# 管理者のみ
/admin/users                            ← ユーザー一覧
/admin/vulnerabilities                  ← 全脆弱性一覧
/admin/notifications                    ← 全通知一覧
/admin/batches                          ← 全バッチ一覧
/admin/notification-channels           ← 全通知チャネル一覧
```

**Next.js Route Groups によるレイアウト・認可の分離:**

| Route Group | 対象 | 認可 |
|---|---|---|
| `(public)/(auth)` | `/signin` `/signup` | 未認証のみ（認証済みはリダイレクト） |
| `(private)` | 全認証済みルート | 認証済みのみ |
| `(private)/(member)` | `/dashboard/*` `/settings/*` 等 | 一般ユーザー・管理者共通 |
| `(private)/(admin)` | `/admin/*` | 管理者のみ |

`middleware.ts` でパスのプレフィックスを見てグループ単位で認可を制御する。

---

### ディレクトリ構成

**Bulletproof-react の考え方を踏襲して機能ごとにディレクトリを分ける**

```
packages/web/src/
├── app/
│   ├── layout.tsx
│   ├── (public)/                            # 未認証向け全般
│   │   └── (auth)/                          # 認証ページ専用レイアウト
│   │       ├── layout.tsx
│   │       ├── signin/
│   │       │   └── page.tsx
│   │       └── signup/
│   │           └── page.tsx
│   └── (private)/                           # 認証済み全員
│       ├── layout.tsx                       # 認証チェック
│       ├── (member)/                        # 一般ユーザー向け
│       │   ├── layout.tsx
│       │   ├── dashboard/
│       │   │   ├── page.tsx
│       │   │   ├── notifications/
│       │   │   │   └── page.tsx
│       │   │   └── batches/
│       │   │       └── page.tsx
│       │   ├── settings/
│       │   │   ├── vulnerability-configs/
│       │   │   │   └── page.tsx
│       │   │   └── notification-channels/
│       │   │       └── page.tsx
│       │   ├── vulnerabilities/
│       │   │   └── [id]/
│       │   │       └── page.tsx
│       │   ├── batches/
│       │   │   └── [id]/
│       │   │       └── page.tsx
│       │   └── notifications/
│       │       └── [id]/
│       │           └── page.tsx
│       └── (admin)/                         # 管理者のみ
│           ├── layout.tsx                   # 管理者チェック
│           └── admin/
│               ├── page.tsx
│               ├── users/
│               │   └── page.tsx
│               ├── vulnerabilities/
│               │   └── page.tsx
│               ├── notifications/
│               │   └── page.tsx
│               ├── batches/
│               │   └── page.tsx
│               └── notification-channels/
│                   └── page.tsx
│
├── features/                                # bulletproof-react
│   ├── auth/
│   │   ├── api/                             # TanStack Query フック
│   │   │   ├── useSignIn.ts
│   │   │   └── useSignIn.test.ts            # コロケーション
│   │   ├── components/
│   │   │   ├── SignInForm.tsx
│   │   │   ├── SignInForm.test.tsx
│   │   │   └── SignUpForm.tsx
│   │   ├── hooks/                           # フィーチャー固有のUIロジックフック
│   │   ├── stores/                          # フィーチャー固有のJotai atoms
│   │   ├── types/
│   │   ├── utils/
│   │   └── index.ts                         # 外部公開するものだけエクスポート
│   ├── dashboard/
│   │   ├── api/
│   │   │   ├── useVulnerabilities.ts
│   │   │   └── useVulnerabilities.test.ts
│   │   ├── components/
│   │   │   ├── VulnerabilityList.tsx
│   │   │   └── VulnerabilityList.test.tsx
│   │   ├── hooks/
│   │   ├── stores/
│   │   ├── types/
│   │   ├── utils/
│   │   └── index.ts
│   ├── vulnerability/
│   │   ├── api/
│   │   │   ├── useVulnerability.ts
│   │   │   └── useVulnerability.test.ts
│   │   ├── components/
│   │   │   ├── VulnerabilityDetail.tsx
│   │   │   └── VulnerabilityDetail.test.tsx
│   │   ├── hooks/
│   │   ├── stores/
│   │   ├── types/
│   │   ├── utils/
│   │   └── index.ts
│   ├── batch/
│   │   ├── api/
│   │   │   ├── useBatches.ts
│   │   │   ├── useBatches.test.ts
│   │   │   ├── useRunBatch.ts
│   │   │   └── useRunBatch.test.ts
│   │   ├── components/
│   │   │   ├── BatchList.tsx
│   │   │   ├── BatchList.test.tsx
│   │   │   └── RunBatchButton.tsx
│   │   ├── hooks/
│   │   ├── stores/
│   │   ├── types/
│   │   ├── utils/
│   │   └── index.ts
│   ├── notification/
│   │   ├── api/
│   │   │   ├── useNotifications.ts
│   │   │   └── useNotifications.test.ts
│   │   ├── components/
│   │   │   ├── NotificationList.tsx
│   │   │   └── NotificationList.test.tsx
│   │   ├── hooks/
│   │   ├── stores/
│   │   ├── types/
│   │   ├── utils/
│   │   └── index.ts
│   ├── settings/
│   │   ├── api/
│   │   │   ├── useVulnerabilityConfigs.ts
│   │   │   ├── useVulnerabilityConfigs.test.ts
│   │   │   └── useNotificationChannels.ts
│   │   ├── components/
│   │   │   ├── VulnerabilityConfigForm.tsx
│   │   │   ├── VulnerabilityConfigForm.test.tsx
│   │   │   └── NotificationChannelForm.tsx
│   │   ├── hooks/
│   │   ├── stores/
│   │   ├── types/
│   │   ├── utils/
│   │   └── index.ts
│   └── admin/
│       ├── api/
│       │   ├── useUsers.ts
│       │   └── useUsers.test.ts
│       ├── components/
│       │   ├── UserList.tsx
│       │   └── UserList.test.tsx
│       ├── hooks/
│       ├── stores/
│       ├── types/
│       ├── utils/
│       └── index.ts
│
├── components/                              # 共有コンポーネント
│   └── ui/                                  # shadcn/ui
│       └── button.tsx
│
├── config/                                  # 環境変数・グローバル設定
│   └── env.ts
│
├── providers/                               # グローバルプロバイダー
│   ├── QueryProvider.tsx                    # TanStack Query
│   └── index.tsx                            # 全プロバイダーをまとめてエクスポート
│
├── lib/
│   ├── api.ts                               # Hono RPC クライアント
│   └── utils.ts
│
├── stores/                                  # Jotai atoms（グローバル）
│   └── authAtom.ts
│
├── hooks/                                   # 共有カスタムフック
│   └── useCurrentUser.ts
│
├── testing/                                 # 共有テストインフラ
│   ├── mocks/
│   │   ├── handlers/
│   │   │   └── app.ts
│   │   └── server.ts
│   └── utils/
│
└── middleware.ts
```

---

### エラーハンドリング

#### エラーの表示方法

API は RFC 9457 形式でエラーを返す。フロントは `type` フィールドで分岐する。

```typescript
onError: (error) => {
  switch (error.type) {
    case '/problems/unauthorized':
      router.push('/auth/signin')
      break
    case '/problems/validation-error':
      // error.errors をフォームにマッピング
      break
    case '/problems/forbidden':
      router.push('/dashboard')
      break
    default:
      toast.error(error.title)
  }
}
```

| エラー種別 | `type` | HTTP ステータス | 表示方法 |
|---|---|---|---|
| バリデーションエラー | `/problems/validation-error` | 422 | フォームのインライン表示（React Hook Form） |
| 認証エラー | `/problems/unauthorized` | 401 | サインインページにリダイレクト |
| 権限エラー | `/problems/forbidden` | 403 | ダッシュボードにリダイレクト |
| リクエスト・競合エラー | `/problems/bad-request` `/problems/conflict` | 400・409 | Toast 表示（Sonner） |
| サーバーエラー | `/problems/internal-server-error` | 500 | `error.tsx` のエラーページ |
| ページ未存在 | - | 404 | `not-found.tsx` のエラーページ |

#### Toast ライブラリ

shadcn/ui 組み込みの **Sonner** を使用する。

#### エラーページの配置

Next.js App Router の規約に従い以下の特殊ファイルを配置する。

| ファイル | 役割 | 備考 |
|---|---|---|
| `app/not-found.tsx` | グローバル 404 ページ | - |
| `app/global-error.tsx` | ルートレイアウトのエラー境界 | `'use client'` 必須 |
| `app/(private)/error.tsx` | 認証済みエリアのエラー境界 | `'use client'` 必須 |
| `app/(private)/not-found.tsx` | 認証済みエリアの 404 | - |

```
app/
  not-found.tsx              ← グローバル 404
  global-error.tsx           ← ルートレイアウトのエラー境界（'use client'）
  (private)/
    error.tsx                ← 認証済みエリアのエラー境界（'use client'）
    not-found.tsx            ← 認証済みエリアの 404
```
