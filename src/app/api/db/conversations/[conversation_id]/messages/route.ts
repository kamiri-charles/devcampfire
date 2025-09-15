import { db } from "@/index";
import { messages, users, conversations } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import { pusherServer } from "@/lib/pusher";


export async function GET(_req: NextRequest, { params } : {params: Promise<{conversation_id: string}>}) {
	const conversation_id = (await params).conversation_id;
	try {
		const session = await auth();
		if (!session) {
			return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
				status: 401,
			});
		}

		const convo = await db
			.select()
			.from(conversations)
			.where(eq(conversations.id, conversation_id))
			.limit(1);

		if (convo.length === 0) {
			return new NextResponse(JSON.stringify({ error: "Conversation not found" }), {
				status: 404,
			});
		}

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
		console.error("Error fetching messages:", err);
		return new NextResponse(JSON.stringify({ error: "Server error" }), {
			status: 500,
		});
	}
}


export async function POST(req: NextRequest, { params } : {params: Promise<{conversation_id: string}>}) {
	const conversation_id = (await params).conversation_id;
	try {
		const session = await auth();
		if (!session) {
			return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
				status: 401,
			});
		}

		const convo = await db
			.select()
			.from(conversations)
			.where(eq(conversations.id, conversation_id))
			.limit(1);

		if (convo.length === 0) {
			return new NextResponse(JSON.stringify({ error: "Conversation not found" }), {
				status: 404,
			});
		}

		const body = await req.json();
		const content = body.content;

		if (typeof content !== "string" || content.trim() === "") {
			return new NextResponse(JSON.stringify({ error: "Invalid content" }), {
				status: 400,
			});
		}

		const [inserted] = await db
			.insert(messages)
			.values({
				content: content,
				senderId: session.user.dbId,
				conversationId: conversation_id,
			})
			.returning();

		// Refetch enriched message with sender info
		const [newMessage] = await db
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
				`conversation-${conversation_id}`,
				"new-message",
				newMessage
			);

		return new NextResponse(JSON.stringify(newMessage), { status: 201 });
	} catch (err) {
		console.error("Error creating message:", err);
		return new NextResponse(JSON.stringify({ error: "Server error" }), {
			status: 500,
		});
	}
}