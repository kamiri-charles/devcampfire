import { db } from "@/index";
import {
	messages,
	users,
	conversations,
	conversationParticipants,
} from "@/db/schema";
import { eq, desc, and } from "drizzle-orm";
import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
	_req: NextRequest,
	{ params }: { params: Promise<{ conversationId: string }> }
) {
	const conversation_id = (await params).conversationId;

	try {
		const session = await auth();
		if (!session?.user?.dbId) {
			return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
				status: 401,
			});
		}

		// Check that the conversation exists and is a DM
		const convo = await db
			.select()
			.from(conversations)
			.where(eq(conversations.id, conversation_id))
			.limit(1);

		if (convo.length === 0) {
			return new NextResponse(
				JSON.stringify({ error: "Conversation not found" }),
				{
					status: 404,
				}
			);
		}

		if (convo[0].type !== "dm") {
			return new NextResponse(
				JSON.stringify({ error: "Not a DM conversation" }),
				{
					status: 403,
				}
			);
		}

		// Check if user is a participant
		const participant = await db
			.select()
			.from(conversationParticipants)
			.where(
				and(
					eq(conversationParticipants.conversationId, conversation_id),
					eq(conversationParticipants.userId, session.user.dbId)
				)
			)
			.limit(1);

		if (participant.length === 0) {
			return new NextResponse(JSON.stringify({ error: "Forbidden" }), {
				status: 403,
			});
		}

		// Fetch messages with sender details
		const convoMessages = await db
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
			.where(eq(messages.conversationId, conversation_id))
			.orderBy(desc(messages.createdAt));

		return new NextResponse(JSON.stringify(convoMessages), { status: 200 });
	} catch (err) {
		console.error("Error fetching DM messages:", err);
		return new NextResponse(JSON.stringify({ error: "Server error" }), {
			status: 500,
		});
	}
}
