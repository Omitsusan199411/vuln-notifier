import type { UserLlmTokenBudget } from "@/domain/user-llm-token-budget/entity.js";
import type { UserLlmTokenBudgetRepository } from "@/domain/user-llm-token-budget/repository.js";
import { PrismaUserLlmTokenBudgetMapper } from "@/infrastructure/prisma/user-llm-token-budget/mapper.js";
import prisma from "@/lib/prisma.js";

export class PrismaUserLlmTokenBudgetRepository
	implements UserLlmTokenBudgetRepository
{
	async findByUserId(userId: string): Promise<UserLlmTokenBudget | null> {
		const foundUserLlmTokenBudget = await prisma.userLlmTokenBudget.findUnique({
			where: {
				userId,
			},
		});

		if (!foundUserLlmTokenBudget) return null;
		return PrismaUserLlmTokenBudgetMapper.toDomain(foundUserLlmTokenBudget);
	}

	async create(
		uerLlmTokenBudget: UserLlmTokenBudget,
	): Promise<UserLlmTokenBudget> {
		const data =
			PrismaUserLlmTokenBudgetMapper.toCreatePersistence(uerLlmTokenBudget);

		const createdUserLlmTokenBudget = await prisma.userLlmTokenBudget.create({
			data,
		});

		return PrismaUserLlmTokenBudgetMapper.toDomain(createdUserLlmTokenBudget);
	}

	async update(
		uerLlmTokenBudget: UserLlmTokenBudget,
	): Promise<UserLlmTokenBudget> {
		const data =
			PrismaUserLlmTokenBudgetMapper.toUpdatePersistence(uerLlmTokenBudget);

		const updatedUserLlmTokenBudget = await prisma.userLlmTokenBudget.update({
			where: {
				id: uerLlmTokenBudget.id,
			},
			data,
		});

		return PrismaUserLlmTokenBudgetMapper.toDomain(updatedUserLlmTokenBudget);
	}
}
