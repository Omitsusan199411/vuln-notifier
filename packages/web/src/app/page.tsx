"use client";

import { useEffect, useState } from "react";

export default function Home() {
	const [message, setMessage] = useState<string | null>(null);

	useEffect(() => {
		fetch("http://localhost:3001/")
			.then((res) => res.json())
			.then((data) => setMessage(data.message));
	}, []);

	return <p>{message}</p>;
}
