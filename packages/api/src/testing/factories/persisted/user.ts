import { Factory } from "fishery";
import { User } from "@/domain/user/entity.js";
import type { NewUserProps } from "@/domain/user/entity.type.js";
import type { User as UserRecord } from "@/generated/prisma/client.js";
import { PrismaUserMapper } from "@/infrastructure/prisma/user/mapper.js";
import prisma from "@/lib/prisma.js";
import { newUserPropsFactory } from "@/testing/factories/user.js";

export const userFactory = Factory.define<NewUserProps, unknown, UserRecord>(
	({ onCreate }) => {
		// create()実行時だけ呼ばれる保存処理を登録。引数userには下のreturnで組み立てたオブジェクトがそのまま渡ってくる(fishery仕様)
		onCreate(async (user) => {
			const data = PrismaUserMapper.toCreatePersistence(User.create(user));

			return await prisma.user.create({
				data,
			});
		});

		return newUserPropsFactory.build();
	},
);
