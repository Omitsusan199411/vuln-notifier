import { Ecosystem } from "@/domain/ecosystem/entity.js";
import type {
	Ecosystem as EcosystemRecord,
	Prisma,
} from "@/generated/prisma/client.js";

export class PrismaEcosystemMapper {
	// DBレコードをドメインオブジェクトへ変換
	static toDomain(record: EcosystemRecord): Ecosystem {
		const { id, name } = record;
		return Ecosystem.reconstruct({
			id,
			name,
		});
	}

	// ドメインエンティティをPrismaが永続化できる形へ整形する
	static toCreatePersistence(
		ecosystem: Ecosystem,
	): Prisma.EcosystemCreateInput {
		const { id, name } = ecosystem;
		return { id, name };
	}
}
