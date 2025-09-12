import { db } from "@/index";
import { messages, users, conversations } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";


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
