import type { User } from "@/domain/user/entity.js";

export interface UserRepository {
	findById(userId: string): Promise<User | null>;
	fetchList(params: {
		cursor?: string;
		limit?: number;
		sort?: "desc" | "asc";
	}): Promise<{
		users: User[];
		lastCursor: string | null;
	}>;
	create(user: User): Promise<User>;
}
