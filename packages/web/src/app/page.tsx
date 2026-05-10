"use client";

import { useEffect, useState } from "react";

export default function Home() {
	const [message, setMessage] = useState<string | null>(null);

	useEffect(() => {
		fetch(`${process.env.NEXT_PUBLIC_API_URL}/`)
			.then((res) => res.json())
			.then((data) => setMessage(data.message));
	}, []);

	return <p>{message}</p>;
}
