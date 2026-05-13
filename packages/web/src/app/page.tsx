"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export default function Home() {
	const [message, setMessage] = useState<string | null>(null);

	useEffect(() => {
		fetch(`${process.env.NEXT_PUBLIC_API_URL}/`)
			.then((res) => res.json())
			.then((data) => setMessage(data.message));
	}, []);

	return (
		<>
			<p>{message}</p>
			<Button className="border border-blue-500 text-blue-500 bg-white">
				テストボタン1
			</Button>
			<Button variant="outline">テストボタン2</Button>
		</>
	);
}
