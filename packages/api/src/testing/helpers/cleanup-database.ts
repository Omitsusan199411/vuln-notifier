import prisma from "@/lib/prisma.js";

export const cleanupDatabase = async () => {
	const tables = await prisma.$queryRaw<{ tablename: string }[]>`
		SELECT tablename FROM pg_tables
		WHERE schemaname = 'public' AND tablename != '_prisma_migrations'
	`;

	const tableNames = tables.map((table) => `"${table.tablename}"`).join(", ");
	if (!tableNames) return;

	// テーブル名はSQLのステートメントそのものなので$executeRaw（プリペアドステートメント）は使えない。ただし、tableNamesはユーザーが動的に注入するものではないので問題ない。ましてやテストDBなので問題ない
	await prisma.$executeRawUnsafe(
		`TRUNCATE TABLE ${tableNames} RESTART IDENTITY CASCADE`,
	);
};
