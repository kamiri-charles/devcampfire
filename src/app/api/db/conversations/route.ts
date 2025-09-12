import { eq } from "drizzle-orm";
import { db } from "@/index";
import { conversations, conversationParticipants, users, DBConversation } from "@/db/schema";
import { auth } from "@/auth";

export async function POST(req: Request) {
	try {
		const { targetUsername } = await req.json();
		const session = await auth();

		if (!session?.user.username) return new Response("Unauthorized", { status: 401 });

		// Fetch current user
		const [currentUser] = await db
			.select()
			.from(users)
			.where(eq(users.githubUsername, session.user.username));

		if (!currentUser) return new Response("User not found", { status: 404 });

		// Fetch target user
		const [targetUser] = await db
			.select()
			.from(users)
			.where(eq(users.githubUsername, targetUsername));

		if (!targetUser)
			return new Response("Target user not found", { status: 404 });

		// Get all DMs
		const dmConversations = await db
			.select()
			.from(conversations)
			.where(eq(conversations.type, "dm"));

		// Check if DM already exists
		let existingDM: DBConversation | undefined;
		for (const conv of dmConversations) {
			const participants = await db
				.select()
				.from(conversationParticipants)
				.where(eq(conversationParticipants.conversationId, conv.id));

			const ids = participants.map((p) => p.userId);
			if (
				ids.includes(currentUser.id) &&
				ids.includes(targetUser.id) &&
				ids.length === 2
			) {
				existingDM = conv;
				break;
			}
		}

		if (existingDM) {
			return new Response(JSON.stringify({ conversationId: existingDM.id }), {
				status: 200,
			});
		}

		// Create new DM conversation
		const [newConversation] = await db
			.insert(conversations)
			.values({
				type: "dm",
				createdBy: currentUser.id,
			})
			.returning();

		// Add participants
		await db.insert(conversationParticipants).values([
			{ conversationId: newConversation.id, userId: currentUser.id },
			{ conversationId: newConversation.id, userId: targetUser.id },
		]);

		return new Response(
			JSON.stringify({ conversationId: newConversation.id }),
			{ status: 201 }
		);
	} catch (err) {
		console.error(err);
		return new Response("Server error", { status: 500 });
	}
}
