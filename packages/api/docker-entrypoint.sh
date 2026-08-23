#!/bin/sh

set -eu

prisma migrate deploy
DATABASE_URL="$TEST_DATABASE_URL" prisma migrate deploy
prisma generate

# execでプロセスID1に置き換え、SIGTERMがpnpm devのプロセスに直接届くようにする（コンテナを修了するときに正常修了させるため）
exec pnpm dev
