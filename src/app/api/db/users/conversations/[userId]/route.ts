import { eq, and, inArray, sql, gt } from "drizzle-orm";
import { db } from "@/index";
import {
	conversations,
	conversationParticipants,
	messages,
	users,
	conversationReads,
} from "@/db/schema";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
	try {
		const { userId } = await params;

		if (!userId) {
			return new Response("Missing userId", { status: 400 });
		}

		// Get all DM conversation IDs for this user
		const participantRows = await db
			.select({ conversationId: conversationParticipants.conversationId })
			.from(conversationParticipants)
			.where(eq(conversationParticipants.userId, userId));

		const conversationIds = participantRows.map((p) => p.conversationId);

		if (conversationIds.length === 0) {
			return new Response(JSON.stringify([]));
		}

		// Fetch DM conversations
		const userConversations = await db
			.select()
			.from(conversations)
			.where(
				and(
					eq(conversations.type, "dm"),
					inArray(conversations.id, conversationIds)
				)
			);

		// Fetch participants and latest message for each conversation
		const convsWithDetails = await Promise.all(
			userConversations.map(async (conv) => {
				// Participants
				const participants = await db
					.select()
					.from(conversationParticipants)
					.innerJoin(users, eq(users.id, conversationParticipants.userId))
					.where(eq(conversationParticipants.conversationId, conv.id));

				// Latest message
				const [latestMsg] = await db
					.select()
					.from(messages)
					.where(eq(messages.conversationId, conv.id))
					.orderBy(sql`${messages.createdAt} DESC`)
					.limit(1);

				const [readRow] = await db
					.select()
					.from(conversationReads)
					.where(
						and(
							eq(conversationReads.conversationId, conv.id),
							eq(conversationReads.userId, userId)
						)
					);

				// Count unread messages
				const unreadCount = latestMsg
					? await db
							.select({ count: sql<number>`count(*)` })
							.from(messages)
							.where(
								and(
									eq(messages.conversationId, conv.id),
									gt(messages.createdAt, readRow?.updatedAt ?? new Date(0))
								)
							)
					: 0;

				return {
					...conv,
					participants: participants.map((p) => ({
						id: p.users.id,
						name: p.users.name,
						githubUsername: p.users.githubUsername,
						imageUrl: p.users.imageUrl,
						status: p.users.status
					})),
					latestMessage: latestMsg
						? {
								id: latestMsg.id,
								content: latestMsg.content,
								senderId: latestMsg.senderId,
								createdAt: latestMsg.createdAt,
						  }
						: null,
					unreadCount,
				};
			})
		);

		return new Response(JSON.stringify(convsWithDetails));
	} catch (err) {
		console.error(err);
		return new Response("Server error", { status: 500 });
	}
}
