import { faker } from "@faker-js/faker";
import { Factory } from "fishery";
import type { Ecosystem } from "@/generated/prisma/client.js";
import prisma from "@/lib/prisma.js";

export const ecosystemFactory = Factory.define<Ecosystem>(({ onCreate }) => {
	// create()実行時だけ呼ばれる保存処理を登録。引数ecosystemには下のreturnで組み立てたオブジェクトがそのまま渡ってくる(fishery仕様)
	onCreate((ecosystem) =>
		prisma.ecosystem.create({
			data: ecosystem,
		}),
	);

	return {
		id: faker.string.nanoid(),
		name: "npm",
		createdAt: faker.date.recent(),
		updatedAt: faker.date.recent(),
	};
});
