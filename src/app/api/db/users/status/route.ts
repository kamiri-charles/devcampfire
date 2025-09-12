import { db } from "@/index";
import { users } from "@/db/schema";
import { auth } from "@/auth";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
	const session = await auth();
	if (!session?.user?.username) {
		return new Response("Unauthorized", { status: 401 });
	}

	const { status } = await req.json();

	await db
		.update(users)
		.set({
			status,
			lastActiveAt: new Date(),
		})
		.where(eq(users.githubUsername, session.user.username));

	return new Response("Status updated", { status: 200 });
}
