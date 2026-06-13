import { cors } from "hono/cors";

const origin = process.env.CORS_ORIGIN;
if (!origin) {
	throw new Error("CORS origin environment variable is required");
}

export const corsMiddleware = cors({
	origin,
	allowHeaders: ["Authorization", "Content-Type"],
	allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
	exposeHeaders: ["Content-Length"],
	maxAge: 600,
	credentials: true,
});
