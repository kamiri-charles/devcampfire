import { db } from "@/index";
import { conversationReads } from "@/db/schema";
import { auth } from "@/auth";
import { eq, and, gt } from "drizzle-orm";

export async function POST(
	req: Request,
	{ params }: { params: Promise<{ conversation_id: string }> }
) {
	const { conversation_id } = await params;

	try {
		const session = await auth();

		if (!session?.user?.dbId) {
			return new Response("Unauthorized", { status: 401 });
		}

		// fetch current record
		const [existing] = await db
			.select()
			.from(conversationReads)
			.where(
				and(
					eq(conversationReads.conversationId, conversation_id),
					eq(conversationReads.userId, session.user.dbId)
				)
			);

		if (existing) {
			await db
				.update(conversationReads)
				.set({ updatedAt: new Date() })
				.where(eq(conversationReads.id, existing.id));
		} else {
			await db.insert(conversationReads).values({
				conversationId: conversation_id,
				userId: session.user.dbId,
				updatedAt: new Date(),
			});
		}

		return new Response("Marked as read", { status: 200 });
	} catch (err) {
		console.error(err);
		return new Response("Server error", { status: 500 });
	}
}
