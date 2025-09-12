import { NextResponse } from "next/server";
import { db } from "@/index";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
	req: Request,
	{ params }: { params: Promise<{ username: string }> }
) {
	const { username } = await params;


	try {
        const [user] = await db
            .select()
            .from(users)
            .where(eq(users.githubUsername, username));
    
		return NextResponse.json({ exists: Boolean(user) });
	} catch (err) {
		console.error(err);
		return NextResponse.json({ exists: false }, { status: 500 });
	}
}
