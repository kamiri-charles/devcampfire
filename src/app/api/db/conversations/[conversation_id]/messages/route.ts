import { db } from "@/index";
import { messages, users, conversations } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { auth } from "@/auth";

interface Params {
	params: {
		conversationId: string;
	};
}

export async function GET(req: Request, { params }: Params) {
	try {
		const session = await auth();
		if (!session?.user?.id) {
			return new Response(JSON.stringify({ error: "Unauthorized" }), {
				status: 401,
			});
		}

		const convo = await db
			.select()
			.from(conversations)
			.where(eq(conversations.id, params.conversationId))
			.limit(1);

		if (convo.length === 0) {
			return new Response(JSON.stringify({ error: "Conversation not found" }), {
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
			.where(eq(messages.conversationId, params.conversationId))
			.orderBy(desc(messages.createdAt));

		return new Response(JSON.stringify(convoMessages), { status: 200 });
	} catch (err) {
		console.error("Error fetching messages:", err);
		return new Response(JSON.stringify({ error: "Server error" }), {
			status: 500,
		});
	}
}
