import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { corsMiddleware } from "@/middleware/cors.js";

export const app = new Hono();

// CORSミドルウェアの適用
app.use("*", corsMiddleware);

app.get("/", (c) => {
	return c.json({ message: "Hello Hono!" });
});

serve(
	{
		fetch: app.fetch,
		port: 3001,
	},
	(info) => {
		console.log(`Server is running on http://localhost:${info.port}`);
	},
);
