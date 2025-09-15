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
import { auth } from "@/auth";

export async function GET(req: NextRequest) {
	try {

        const session = await auth();

        if (!session) {
            return new Response("Unauthorized", { status: 401 });
        }
        if (!session.user?.dbId) {
            return new Response("Unauthorized", { status: 401 });
        }

        const userId = session.user.dbId;


		const { searchParams } = new URL(req.url);
		const limitParam = searchParams.get("limit");
		const limit = limitParam ? parseInt(limitParam, 10) : undefined;

		// Get all DM conversation IDs for this user
		const participantRows = await db
			.select({ conversationId: conversationParticipants.conversationId })
			.from(conversationParticipants)
			.where(eq(conversationParticipants.userId, userId));

		const conversationIds = participantRows.map((p) => p.conversationId);

		if (conversationIds.length === 0) {
			return new Response(JSON.stringify([]));
		}

		// Fetch DM conversations (ordered & limited at DB level)
		const userConversations = await (limit
			? db
					.select()
					.from(conversations)
					.where(
						and(
							eq(conversations.type, "dm"),
							inArray(conversations.id, conversationIds)
						)
					)
					.orderBy(sql`${conversations.updatedAt} DESC`)
					.limit(limit)
			: db
					.select()
					.from(conversations)
					.where(
						and(
							eq(conversations.type, "dm"),
							inArray(conversations.id, conversationIds)
						)
					)
					.orderBy(sql`${conversations.updatedAt} DESC`));

		// Fetch participants and latest message for each conversation
		const convsWithDetails = await Promise.all(
			userConversations.map(async (conv) => {
				// Participants
				const participants = await db
					.select()
					.from(conversationParticipants)
					.innerJoin(users, eq(users.id, conversationParticipants.userId))
					.where(eq(conversationParticipants.conversationId, conv.id));

				// Latest message (with sender info)
				const [latestMsg] = await db
					.select({
						id: messages.id,
						content: messages.content,
						createdAt: messages.createdAt,
						updatedAt: messages.updatedAt,
						sender: {
							id: users.id,
							name: users.name,
							githubUsername: users.githubUsername,
							imageUrl: users.imageUrl,
							status: users.status,
						},
					})
					.from(messages)
					.innerJoin(users, eq(messages.senderId, users.id))
					.where(eq(messages.conversationId, conv.id))
					.orderBy(sql`${messages.createdAt} DESC`)
					.limit(1);

				// Read state
				const [readRow] = await db
					.select()
					.from(conversationReads)
					.where(
						and(
							eq(conversationReads.conversationId, conv.id),
							eq(conversationReads.userId, userId)
						)
					);

				// Unread count
				const unreadCountResult = await db
					.select({ count: sql<number>`count(*)` })
					.from(messages)
					.where(
						and(
							eq(messages.conversationId, conv.id),
							gt(messages.createdAt, readRow?.updatedAt ?? new Date(0))
						)
					);

				const unreadCount = unreadCountResult[0]?.count ?? 0;

				return {
					...conv,
					participants: participants.map((p) => ({
						id: p.users.id,
						name: p.users.name,
						githubUsername: p.users.githubUsername,
						imageUrl: p.users.imageUrl,
						status: p.users.status,
					})),
					latestMessage: latestMsg
						? {
								id: latestMsg.id,
								content: latestMsg.content,
								createdAt: latestMsg.createdAt,
								updatedAt: latestMsg.updatedAt,
								sender: latestMsg.sender,
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
