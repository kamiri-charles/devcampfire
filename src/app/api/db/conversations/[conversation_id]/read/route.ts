import { db } from "@/index";
import { conversationReads } from "@/db/schema";
import { auth } from "@/auth";
import { eq, and } from "drizzle-orm";

export async function POST(
	req: Request,
	{ params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
	try {
		const { lastReadMessageId } = await req.json();
		const session = await auth();

		if (!session?.user?.username) {
			return new Response("Unauthorized", { status: 401 });
		}

		// upsert read state
		const [existing] = await db
			.select()
			.from(conversationReads)
			.where(
				and(
					eq(conversationReads.conversationId, id),
					eq(conversationReads.userId, session.user.dbId)
				)
			);

		if (existing) {
			await db
				.update(conversationReads)
				.set({
					lastReadMessageId,
					updatedAt: new Date(),
				})
				.where(eq(conversationReads.id, existing.id));
		} else {
			await db.insert(conversationReads).values({
				conversationId: id,
				userId: session.user.dbId,
				lastReadMessageId,
			});
		}

		return new Response("Marked as read", { status: 200 });
	} catch (err) {
		console.error(err);
		return new Response("Server error", { status: 500 });
	}
}
