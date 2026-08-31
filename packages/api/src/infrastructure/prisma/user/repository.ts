import type { User } from "@/domain/user/entity.js";
import type { UserRepository } from "@/domain/user/repository.js";
import prisma from "@/lib/prisma.js";
import {
	buildCursorQueryOptions,
	sliceCursorPage,
} from "../shared/pagination.js";
import { PrismaUserMapper } from "./mapper.js";

export class PrismaUserRepository implements UserRepository {
	async findById(userId: string): Promise<User | null> {
		const user = await prisma.user.findUnique({
			where: {
				id: userId,
			},
		});
		if (!user) return null;
		return PrismaUserMapper.toDomain(user);
	}

	async fetchList(params: {
		cursor?: string;
		limit?: number;
		sort?: "desc" | "asc";
	}): Promise<{
		users: User[];
		lastCursor: string | null;
	}> {
		const { cursor, limit = 10, sort = "desc" } = params;

		const paginationParams = buildCursorQueryOptions({
			cursor,
			limit,
		});

		const fetchedUsers = await prisma.user.findMany({
			orderBy: {
				createdAt: sort,
			},
			...paginationParams,
		});

		const { slicedRecords, hasNextPage } = sliceCursorPage(fetchedUsers, limit);

		const users = slicedRecords.map((user) => PrismaUserMapper.toDomain(user));

		const lastCursor = hasNextPage ? (users.at(-1)?.id ?? null) : null;

		return { users, lastCursor };
	}

	async create(user: User): Promise<User> {
		const data = PrismaUserMapper.toCreatePersistence(user);
		const createdUser = await prisma.user.create({
			data,
		});
		return PrismaUserMapper.toDomain(createdUser);
	}
}
