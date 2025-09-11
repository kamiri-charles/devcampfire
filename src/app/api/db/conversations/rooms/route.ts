
import { db } from "@/index";
import { conversations } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function GET() {
	try {
		const session = await auth();
		if (!session) {
			return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
				status: 401,
			});
		}

		const groups = await db
			.select()
			.from(conversations)
			.where(
                eq(conversations.type, "group")
			);

		return new NextResponse(JSON.stringify(groups), { status: 200 });
        
	} catch (err) {
		console.error("Error fetching groups:", err);
		return new NextResponse(JSON.stringify({ error: "Server error" }), {
			status: 500,
		});
	}
}
