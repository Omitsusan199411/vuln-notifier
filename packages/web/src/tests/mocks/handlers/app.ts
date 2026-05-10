import { HttpResponse, http } from "msw";

export const appHandlers = [
	http.get(`${process.env.NEXT_PUBLIC_API_URL}/`, () => {
		return HttpResponse.json({
			message: "Hello Hono!",
		});
	}),
];
