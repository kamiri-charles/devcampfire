import { db } from "@/index";
import { users } from "@/db/schema";
import { inArray } from "drizzle-orm";

export async function POST(req: Request) {
	const { usernames } = await req.json();

	if (!Array.isArray(usernames) || usernames.length === 0) {
		return Response.json({ users: [] });
	}

	const found = await db
		.select()
		.from(users)
		.where(inArray(users.githubUsername, usernames));

	return Response.json({
		users: found.map((u) => ({
			id: u.id,
			githubUsername: u.githubUsername,
			name: u.name,
			imageUrl: u.imageUrl,
		})),
	});
}
