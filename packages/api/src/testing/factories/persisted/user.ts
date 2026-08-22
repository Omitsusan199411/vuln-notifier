import { faker } from "@faker-js/faker";
import { Factory } from "fishery";
import type { User } from "@/generated/prisma/client.js";
import prisma from "@/lib/prisma.js";

export const userFactory = Factory.define<User>(({ onCreate }) => {
	// create()実行時だけ呼ばれる保存処理を登録。引数userには下のreturnで組み立てたオブジェクトがそのまま渡ってくる(fishery仕様)
	onCreate((user) => prisma.user.create({ data: user }));

	return {
		id: faker.string.nanoid(),
		cognitoSub: faker.string.uuid(),
		createdAt: faker.date.recent(),
		updatedAt: faker.date.recent(),
	};
});
