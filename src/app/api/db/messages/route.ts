import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/index";
import { messages, users } from "@/db/schema";
import { pusherServer } from "@/lib/pusher";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
	const session = await auth();
	if (!session) {
		return new NextResponse("Unauthorized", { status: 401 });
	}

	const { conversationId, content } = await req.json();

	// Insert message
	const [inserted] = await db
		.insert(messages)
		.values({
			conversationId,
			senderId: session.user.dbId,
			content,
		})
		.returning();

	// Re-fetch enriched message with sender info
	const [fullMessage] = await db
		.select({
			id: messages.id,
			content: messages.content,
			createdAt: messages.createdAt,
			updatedAt: messages.updatedAt,
			sender: {
				id: users.id,
				name: users.name,
				imageUrl: users.imageUrl,
				githubUsername: users.githubUsername,
			},
		})
		.from(messages)
		.innerJoin(users, eq(messages.senderId, users.id))
		.where(eq(messages.id, inserted.id));

	await pusherServer.trigger(
		`conversation-${conversationId}`,
		"new-message",
		fullMessage
	);

	return NextResponse.json(fullMessage);
}
