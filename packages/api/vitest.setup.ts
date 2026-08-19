import { afterEach } from "vitest";
import { cleanupDatabase } from "./src/testing/helpers/cleanup-database.js";

afterEach(async () => {
	await cleanupDatabase();
});
