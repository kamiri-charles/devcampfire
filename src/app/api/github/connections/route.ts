import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET() {
	const session = await auth();

	if (!session?.accessToken) {
		return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
	}

	try {
		// Followers + following
		const [followersRes, followingRes] = await Promise.all([
			fetch("https://api.github.com/user/followers?per_page=100", {
				headers: { Authorization: `token ${session.accessToken}` },
			}),
			fetch("https://api.github.com/user/following?per_page=100", {
				headers: { Authorization: `token ${session.accessToken}` },
			}),
		]);

		if (!followersRes.ok || !followingRes.ok) {
			return NextResponse.json(
				{ error: "Failed to fetch connections" },
				{ status: 400 }
			);
		}

		const followers = await followersRes.json();
		const following = await followingRes.json();

		// Sets for comparisons
		const followingSet = new Set(following.map((f: any) => f.login));

		// Mutuals
		const mutuals = followers.filter((f: any) => followingSet.has(f.login));

		return NextResponse.json({
			followers: followers.map((u: any) => ({
				id: u.id,
				username: u.login,
				avatar: u.avatar_url,
			})),
			following: following.map((u: any) => ({
				id: u.id,
				username: u.login,
				avatar: u.avatar_url,
			})),
			mutuals: mutuals.map((u: any) => ({
				id: u.id,
				username: u.login,
				avatar: u.avatar_url,
			})),
		});
	} catch (err) {
		console.error(err);
		return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
	}
}
