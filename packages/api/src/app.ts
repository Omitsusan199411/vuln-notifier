import { Hono } from "hono";
import { corsMiddleware } from "@/middleware/cors.js";

const app = new Hono();

app.use("*", corsMiddleware);

app.get("/", (c) => {
	return c.json({ message: "Hello, World" });
});

export default app;
