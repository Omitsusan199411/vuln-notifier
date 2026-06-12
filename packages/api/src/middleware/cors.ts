import { cors } from "hono/cors";

export const corsMiddleware = cors({
	origin: process.env.CORS_ORIGIN ?? "http://localhost:3000",
	allowHeaders: ["Authorization", "Content-Type"],
	allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
	exposeHeaders: ["Content-Length"],
	maxAge: 600,
	credentials: true,
});
