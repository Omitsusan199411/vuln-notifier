// Prismaを使ったページネーションに関する共通の処理をまとめるファイル

// prismaでcursorページネーションを実現するための必要なパラメータオプション（cursor / skip / take）を組み立てる関数
export const buildCursorQueryOptions = (params: {
	cursor?: string;
	limit?: number;
	fetchExtraRowCount?: number;
	skipCursorRowCount?: number;
}): { cursor?: { id: string }; skip?: number; take: number } => {
	// fetchExtraRowCount(次のページがあるかを判定するため、limit件より1件多く取得する)
	// skipCursorRowCount(cursorの行自体を含めない（前回の最後の1件を今回も返さないようにする）ためskipする件数)
	const {
		cursor,
		limit = 10,
		fetchExtraRowCount = 1,
		skipCursorRowCount = 1,
	} = params;

	return {
		cursor: cursor ? { id: cursor } : undefined,
		skip: cursor ? skipCursorRowCount : undefined,
		take: limit + fetchExtraRowCount,
	};
};

// DBからの取得結果から次のページがあるかを判定して、実際にUIに表示する件数に切り詰める
export const sliceCursorPage = <TRecord>(
	records: TRecord[],
	limit: number,
): { slicedRecords: TRecord[]; hasNextPage: boolean } => {
	const hasNextPage = records.length > limit;
	return { slicedRecords: records.slice(0, limit), hasNextPage };
};
