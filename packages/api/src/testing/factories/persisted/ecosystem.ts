import { Factory } from "fishery";
import { Ecosystem } from "@/domain/ecosystem/entity.js";
import type { ReconstructedEcosystemProps } from "@/domain/ecosystem/entity.type.js";
import type { Ecosystem as EcosystemRecord } from "@/generated/prisma/client.js";
import { Prisma } from "@/generated/prisma/client.js";
import { PrismaEcosystemMapper } from "@/infrastructure/prisma/ecosystem/mapper.js";
import prisma from "@/lib/prisma.js";
import { reconstructedEcosystemPropsFactory } from "@/testing/factories/ecosystem.js";

export const ecosystemFactory = Factory.define<
	ReconstructedEcosystemProps,
	unknown,
	EcosystemRecord
>(({ onCreate }) => {
	// ecosystemはマスタデータで重複作成する必要が無いため、name重複時は既存レコードを取得する。
	// 並列でcreateが呼ばれた場合の競合(unique制約違反)にも対応するため、
	// upsertではなく「作成を試して、負けたら既存を取得する」形にしている
	onCreate(async (ecosystem) => {
		const data = PrismaEcosystemMapper.toCreatePersistence(
			Ecosystem.reconstruct(ecosystem),
		);
		try {
			return await prisma.ecosystem.create({ data });
		} catch (error) {
			if (
				error instanceof Prisma.PrismaClientKnownRequestError &&
				error.code === "P2002"
			) {
				return await prisma.ecosystem.findUniqueOrThrow({
					where: { name: ecosystem.name },
				});
			}
			throw error;
		}
	});

	return reconstructedEcosystemPropsFactory.build();
});
