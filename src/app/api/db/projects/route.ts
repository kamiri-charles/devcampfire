import { auth } from "@/auth";
import { conversationParticipants, conversations, projects } from "@/db/schema";
import { db } from "@/index";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const session = await auth();
        const { name, description, repoUrl, type } = await req.json();

        if (!session?.user.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Create a new conversation first to get its ID
        const [newConversatiion] = await db
            .insert(conversations)
            .values({
                type: "group",
            })
            .returning();

        // Add owner as participant
        await db.insert(conversationParticipants).values([{
            conversationId: newConversatiion.id,
            userId: session.user.dbId,
        }]);

        // Insert the new project with the conversation ID
        const [newProject] = await db
            .insert(projects)
            .values({
                name,
                description,
                type,
                repoUrl,
                ownerId: session.user.dbId,
                conversationId: newConversatiion.id,
            })
            .returning();

        return NextResponse.json({ project: newProject }, { status: 201 });

    } catch (error) {
        console.error("Error creating project:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}