import { User } from "@/domain/user/entity.js";
import type { Prisma, User as UserRecord } from "@/generated/prisma/client.js";

export class PrismaUserMapper {
	static toDomain(record: UserRecord): User {
		const { id, cognitoSub } = record;
		return User.reconstruct({
			id,
			cognitoSub,
		});
	}

	// ドメインエンティティをPrismaが永続化できる形へ整形する。今は形が一致していて変換不要だが、
	// 将来リレーション等が増えた場合はここで整形する
	static toCreatePersistence(user: User): Prisma.UserCreateInput {
		const { cognitoSub } = user;
		return { cognitoSub };
	}
}
