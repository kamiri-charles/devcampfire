
import { db } from "@/index";
import { conversations } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";

export async function GET() {
	try {
		const session = await auth();
		if (!session?.user?.id) {
			return new Response(JSON.stringify({ error: "Unauthorized" }), {
				status: 401,
			});
		}

		const groups = await db
			.select()
			.from(conversations)
			.where(
                eq(conversations.type, "group")
			);

		return new Response(JSON.stringify(groups), { status: 200 });
        
	} catch (err) {
		console.error("Error fetching groups:", err);
		return new Response(JSON.stringify({ error: "Server error" }), {
			status: 500,
		});
	}
}
