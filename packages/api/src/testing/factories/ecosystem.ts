import { faker } from "@faker-js/faker";
import { Factory } from "fishery";
import type { ReconstructedEcosystemProps } from "@/domain/ecosystem/entity.type.js";

// DBに保存済みのレコードを再現する。build専用（onCreateは無く、DBには触らない）
export const reconstructedEcosystemDomainFactory =
	Factory.define<ReconstructedEcosystemProps>(() => ({
		id: faker.string.nanoid(),
		name: "npm",
	}));
