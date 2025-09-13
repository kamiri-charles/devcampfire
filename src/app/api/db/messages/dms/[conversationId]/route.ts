import { db } from "@/index";
import {
	messages,
	users,
	conversations,
	conversationParticipants,
} from "@/db/schema";
import { eq, asc, and } from "drizzle-orm";
import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import { pusherServer } from "@/lib/pusher";

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
			.orderBy(asc(messages.createdAt));

		return new NextResponse(JSON.stringify(convoMessages), { status: 200 });
	} catch (err) {
		console.error("Error fetching DM messages:", err);
		return new NextResponse(JSON.stringify({ error: "Server error" }), {
			status: 500,
		});
	}
}


export async function POST(
	req: NextRequest,
	{ params }: { params: Promise<{ conversationId: string }> }
) {
	const { conversationId } = await params;

	try {
		const session = await auth();
		if (!session?.user?.dbId) {
			return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
				status: 401,
			});
		}

		const { content } = await req.json();
		if (!content || content.trim() === "") {
			return new NextResponse(JSON.stringify({ error: "Empty message" }), {
				status: 400,
			});
		}

		// Check if conversation exists
		const [conv] = await db
			.select()
			.from(conversations)
			.where(eq(conversations.id, conversationId));
		if (!conv) {
			return new NextResponse(
				JSON.stringify({ error: "Conversation not found" }),
				{ status: 404 }
			);
		}

		// Check if user is a participant
		const participant = await db
			.select()
			.from(conversationParticipants)
			.where(eq(conversationParticipants.conversationId, conversationId));

		const isParticipant = participant.some(
			(p) => p.userId === session.user.dbId
		);
		if (!isParticipant) {
			return new NextResponse(JSON.stringify({ error: "Forbidden" }), {
				status: 403,
			});
		}

		// Insert message
		const [newMessage] = await db
			.insert(messages)
			.values({
				conversationId,
				senderId: session.user.dbId,
				content,
			})
			.returning();

		// Update conversation updatedAt
		await db
			.update(conversations)
			.set({ updatedAt: new Date() })
			.where(eq(conversations.id, conversationId));

		// Enrich message with sender info
		const [sender] = await db
			.select({
				id: users.id,
				name: users.name,
				githubUsername: users.githubUsername,
				imageUrl: users.imageUrl,
			})
			.from(users)
			.where(eq(users.id, session.user.dbId));

		const enrichedMessage = {
			id: newMessage.id,
			content: newMessage.content,
			createdAt: newMessage.createdAt,
			updatedAt: newMessage.updatedAt,
			sender,
		};

		// Pusher events
		await pusherServer.trigger(
			`conversation-${conversationId}`,
			"update-conversation",
			{
				id: conv.id,
				latestMessage: enrichedMessage,
				updatedAt: new Date(),
			}
		);

		// Pusher new message event
		await pusherServer.trigger(
			`conversation-${conversationId}`,
			"new-message",
			enrichedMessage
		);

		return new NextResponse(JSON.stringify(enrichedMessage), { status: 201 });
	} catch (err) {
		console.error("Error posting DM:", err);
		return new NextResponse(JSON.stringify({ error: "Server error" }), {
			status: 500,
		});
	}
}

