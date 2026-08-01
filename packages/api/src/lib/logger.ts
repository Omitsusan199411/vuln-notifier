import pino from "pino";

const logger = pino({
	level: "info",
	redact: ["req.headers.authorization", "req.headers.cookie", "*.lineUserId"],
});

export default logger;
