# 認証・認可設計

## 目次

- [概要](#概要)
- [使用ライブラリ](#使用ライブラリ)
- [認証フロー](#認証フロー)
- [セッション管理](#セッション管理)
- [APIへのトークン受け渡し](#apiへのトークン受け渡し)
- [認可](#認可)
- [未決事項](#未決事項)

---

### 概要

```
フロントエンド（Auth.js）→ Cognito（認証）→ バックエンド（JWT検証）
```

- 認証基盤: AWS Cognito
- フロントエンドの認証管理: Auth.js（next-auth）
- バックエンドの認証検証: Cognito の公開鍵（JWKS）による JWT 検証

---

### 使用ライブラリ

| パッケージ | 用途 |
|---|---|
| `next-auth` | フロントエンドの認証管理（Auth.js） |
| `@auth/core` | Auth.js コア |

---

### 認証フロー

```
1. ユーザーがサインイン（Cognito または LINE IdP）
2. Cognito が ID トークン・リフレッシュトークンを発行（アクセストークンは使用しない）
3. Auth.js がトークンを受け取り JWT セッションとして HTTP-only Cookie に保存
4. フロントエンドは Cookie からセッションを取得
5. API リクエスト時に ID トークンを Authorization ヘッダーに付与
6. Hono API が Cognito の JWKS で ID トークンを検証
```

---

### セッション管理

- **方式**: JWT セッション（DB セッション不使用）
- **保存場所**: HTTP-only Cookie（XSS対策）
- **内容**: Cognito ID トークンをセッションに含めて保持

Auth.js の Cognito プロバイダーを使い、`session: { strategy: 'jwt' }` を指定する。`jwt` コールバックでサインイン時に受け取った ID トークンを JWT に保持し、`session` コールバックでそれをセッションオブジェクトに引き渡すことで、以降どこからでも `session.idToken` としてアクセスできるようにする。

---

### APIへのトークン受け渡し

Hono API には **ID トークン**を渡す。ID トークンには `cognitoSub`・`cognito:groups` が含まれており、ユーザー識別と管理者判定を同時に行える。

Hono RPC クライアント（`hc`）の生成時に、Auth.js のセッションから取り出した `idToken` を `Authorization: Bearer` ヘッダーとして付与する。

---

### 認可

| 役割 | 判定方法 |
|---|---|
| 一般ユーザー | 有効な Cognito ID トークンを持つ（グループなし） |
| 管理者 | JWT の `cognito:groups` クレームに `admin` が含まれる |

詳細は [API 設計](../api/design.md) の権限レベル定義を参照。

**フロントエンドの認可:**

`middleware.ts` でパスのプレフィックスを見て認可を制御する。`/admin` 配下は管理者判定に失敗したら `/dashboard` へ、未認証で `/auth` 以外にアクセスしたら `/auth/signin` へリダイレクトする。

---

### セキュリティ要件

| 保護 | 内容 |
|---|---|
| HTTP-only Cookie | JavaScript からトークンを読めない。XSS でのトークン盗難を防ぐ |
| ID トークンの有効期限 | Cognito デフォルト 1時間。漏洩しても被害期間が限定される |
| リフレッシュトークンの無効化 | サインアウト時に Cognito の `RevokeToken` API を呼び、リフレッシュトークンを即時無効化する |

**リフレッシュトークンの漏洩リスク:**

```
ID トークン漏洩     → 最大 1時間で無効 ← 許容範囲
リフレッシュトークン漏洩 → デフォルト 30日間有効 ← 危険
```

リフレッシュトークンはサインアウト時に必ず無効化する。Auth.js の `signOut` イベントで Cognito の `RevokeToken` API を呼び出す。

---

### 未決事項

| 項目 | 内容 |
|---|---|
| LINE IdP 連携 | Cognito の LINE IdP 設定と lineUserId の取得フローは実装フェーズで設計 |
| トークンリフレッシュ | Auth.js のリフレッシュトークン処理の詳細は実装時に確認 |
| ローカル開発 | dev 用 Cognito ユーザープールを使用（cognito-local は不使用） |
