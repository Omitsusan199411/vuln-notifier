import { faker } from "@faker-js/faker";
import { describe, expect, it } from "vitest";
import {
	buildCursorQueryOptions,
	sliceCursorPage,
} from "@/infrastructure/prisma/shared/pagination.js";

describe("Pagination Unit Test", () => {
	describe("buildCursorQueryOptions関数", () => {
		it("cursorの値が引数に渡されている、かつskipCursorRowCountの値が引数で渡されていない場合は、cursor.idとskip（デフォルト値）が設定されていること", () => {
			const cursor = faker.string.uuid({ version: 7 });
			const defaultSkipCursorCount = 1;
			const result = buildCursorQueryOptions({ cursor });

			expect(result.cursor).toEqual({ id: cursor });
			expect(result.skip).toBe(defaultSkipCursorCount);
		});

		it("cursorの値が引数に渡されていない、かつskipCursorRowCountの値が渡される場合は、cursor.idとskipがundefiendに設定されていること", () => {
			const skipCursorRowCount = 2;
			const result = buildCursorQueryOptions({ skipCursorRowCount });

			expect(result.cursor).toBeUndefined;
			expect(result.skip).toBeUndefined;
		});

		it("fetchExtraRowCountの値が引数に渡される、かつlimitの値が引数に渡される場合は、limit + fetchExtraRowCountの件数でtakeが設定されること", () => {
			const limit = 20;
			const fetchExtraRowCount = 5;
			const result = buildCursorQueryOptions({ limit, fetchExtraRowCount });

			expect(result.take).toBe(limit + fetchExtraRowCount);
		});

		it("fetchExtraRowCountの値が引数に渡されない、かつlimitの値が引数に渡される場合は、limit + fectchExtraRowCount（デフォルト値:1）の件数でtakeが設定されること", () => {
			const defaultExtraRowCount = 1;
			const limit = 10;
			const result = buildCursorQueryOptions({ limit });

			expect(result.take).toBe(limit + defaultExtraRowCount);
		});

		it("limitが引数に渡されない、fetchExtraRowCountが引数に渡される場合は、limit（デフォルト値:10）+ fetchExtraRowCountの件数がtakeが設定されること", () => {
			const defaultLimit = 10;
			const fetchExtraRowCount = 5;
			const result = buildCursorQueryOptions({ fetchExtraRowCount });

			expect(result.take).toBe(fetchExtraRowCount + defaultLimit);
		});
	});
	describe("sliceCursorPage関数", () => {
		it("取得したレコード件数がlimitよりも多い場合、limit件数で切り詰められ、hasNextPageフラグがtrueになること", () => {
			const limit = 10;
			const records = [...Array(11).keys()];
			const expectedSlicedRecords = records.slice(0, limit); // 要素数は10

			const result = sliceCursorPage(records, limit);
			expect(result.slicedRecords).toEqual(expectedSlicedRecords);
			expect(result.hasNextPage).toBe(true);
		});

		it("取得したレコード件数がlimitよりも少ない場合、limit件数で切り詰められ、hasNextPageフラグがfalseになること", () => {
			const limit = 5;
			const records = [...Array(4).keys()];
			const expectedSlicedRecords = records.slice(0, limit); // 要素数は4

			const result = sliceCursorPage(records, limit);
			expect(result.slicedRecords).toEqual(expectedSlicedRecords);
			expect(result.hasNextPage).toBe(false);
		});

		it("取得したレコード件数がlimitと同じ場合、limit件数で切り詰められ、hasNextPageフラグがfalseになること", () => {
			const limit = 10;
			const records = [...Array(10).keys()];
			const expectedSlicedRecords = records.slice(0, limit); // 要素数は10

			const result = sliceCursorPage(records, limit);
			expect(result.slicedRecords).toEqual(expectedSlicedRecords);
			expect(result.hasNextPage).toBe(false);
		});

		it("取得したレコードが0件の場合、空配列が返り、hasNextPageフラグがfalseになること", () => {
			const limit = 10;
			const records: number[] = [];
			const expectedSlicedRecords = records.slice(0, limit); // 要素数は0

			const result = sliceCursorPage(records, limit);
			expect(result.slicedRecords).toEqual(expectedSlicedRecords);
			expect(result.hasNextPage).toBe(false);
		});
	});
});
