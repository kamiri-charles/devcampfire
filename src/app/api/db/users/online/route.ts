import { db } from "@/index";
import { users } from "@/db/schema";
import { inArray, and, eq } from "drizzle-orm";
import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
	const { usernames } = await req.json();

	const session = await auth();

	if (!session) {
		return new NextResponse("Unauthorized", { status: 401 });
	}

	if (!Array.isArray(usernames) || usernames.length === 0) {
		return NextResponse.json({ users: [] });
	}

	 const found = await db
			.select()
			.from(users)
			.where(
				and(
					inArray(users.githubUsername, usernames),
					eq(users.status, "online")
				)
			);
    


	return NextResponse.json({
		users: found.map((u) => ({
			id: u.id,
			githubUsername: u.githubUsername,
			name: u.name,
			imageUrl: u.imageUrl,
		})),
	});
}
