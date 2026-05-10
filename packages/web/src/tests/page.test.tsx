import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Page from "@/app/page";

describe("Page", () => {
	it("APIメッセージを表示する", async () => {
		render(<Page />);
		await waitFor(() => {
			expect(screen.getByText("Hello Hono!")).toBeInTheDocument();
		});
	});
});
