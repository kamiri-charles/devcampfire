import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function GET() {
	const session = await auth();

	if (!session?.accessToken) {
		return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
	}

	try {
		const res = await fetch("https://api.github.com/user/repos", {
			headers: {
				Authorization: `token ${session.accessToken}`,
			},
		});

		if (!res.ok) {
			return NextResponse.json(
				{ error: "Failed to fetch repos" },
				{ status: res.status }
			);
		}

		const repos = await res.json();
		return NextResponse.json(repos);
	} catch (err) {
		return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
	}
}
