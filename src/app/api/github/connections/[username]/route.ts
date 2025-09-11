import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET(
	req: Request,
	{ params }: { params: Promise<{ username: string }> }
) {
	const session = await auth();
	if (!session?.accessToken) {
		return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
	}

    const { username } = await params;

	const res = await fetch(`https://api.github.com/users/${username}`, {
		headers: { Authorization: `token ${session.accessToken}` },
	});

	if (!res.ok) {
		return NextResponse.json(
			{ error: "Failed to fetch user" },
			{ status: res.status }
		);
	}

	const u = await res.json();
	return NextResponse.json({
		id: u.id,
		username: u.login,
		avatar: u.avatar_url,
		name: u.name,
		bio: u.bio,
	});
}
