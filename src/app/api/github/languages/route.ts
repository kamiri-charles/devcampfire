import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function GET() {
	const session = await auth();
	if (!session?.accessToken) {
		return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
	}

	try {
		const res = await fetch("https://api.github.com/user/repos?per_page=100", {
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

		// Count languages across repos
		const languageCount: Record<string, number> = {};

		repos.forEach((repo: any) => {
			if (repo.language) {
				languageCount[repo.language] = (languageCount[repo.language] || 0) + 1;
			}
		});

		// Sort by frequency
		const topLanguages = Object.entries(languageCount)
			.sort((a, b) => b[1] - a[1])
			.slice(0, 7)
			.map(([lang]) => lang);

		return NextResponse.json({
			topLanguages,
			repoCount: repos.length,
		});
	} catch (err) {
		console.error("GitHub fetch error:", err);
		return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
	}
}
