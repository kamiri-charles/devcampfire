import { db } from "@/index";
import { users } from "@/db/schema";
import { like } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";
  const limit = Number(searchParams.get("limit") || 5);


    const session = await auth();
    if (!session?.user.username) return new NextResponse("Unauthorized", { status: 401 });
    if (!q) return NextResponse.json([]);

  const results = await db
    .select({
      id: users.id,
      name: users.name,
      username: users.githubUsername,
      imageUrl: users.imageUrl,
      bio: users.bio,
    })
    .from(users)
    .where(like(users.githubUsername, `${q}%`))
    .limit(limit);

  return NextResponse.json(results);
}
