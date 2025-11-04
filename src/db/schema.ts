import {
	pgTable,
	text,
	timestamp,
	uuid,
	pgEnum,
	json,
	boolean,
} from "drizzle-orm/pg-core";

export const userRole = pgEnum("user_role", ["user", "moderator", "admin"]);
export const userStatus = pgEnum("user_status", [
	"online",
	"offline",
	"away",
	"busy",
]);
export const conversationType = pgEnum("conversation_type", ["dm", "group", "channel"]);
export const projectType = pgEnum("project_type", ["public", "private", "internal"]);

export const users = pgTable("users", {
	id: uuid("id").primaryKey().defaultRandom(),
	githubUsername: text("github_username").notNull().unique(),
	name: text("name"),
	email: text("email").unique(),
	imageUrl: text("image_url"),
	bio: text("bio"),

	role: userRole("role").default("user").notNull(),
	status: userStatus("status").default("offline").notNull(),
	lastActiveAt: timestamp("last_active_at", { withTimezone: true }),
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	settings: json("settings").$type<Record<string, any>>().default({}), // TODO: Remove 'any' type
	createdAt: timestamp("created_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
});
;


export const conversations = pgTable("conversations", {
	id: uuid("id").primaryKey().defaultRandom(),

	type: conversationType("type").notNull(),
	name: text("name"),
	description: text("description"),
	createdBy: uuid("created_by").references(() => users.id, {
		onDelete: "cascade",
	}),

	createdAt: timestamp("created_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
});

export const conversationParticipants = pgTable("conversation_participants", {
	id: uuid("id").primaryKey().defaultRandom(),
	conversationId: uuid("conversation_id")
		.references(() => conversations.id, { onDelete: "cascade" })
		.notNull(),
	userId: uuid("user_id")
		.references(() => users.id, { onDelete: "cascade" })
		.notNull(),
	isAdmin: boolean("is_admin").default(false).notNull(),
	joinedAt: timestamp("joined_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
});

export const messages = pgTable("messages", {
	id: uuid("id").primaryKey().defaultRandom(),
	conversationId: uuid("conversation_id")
		.references(() => conversations.id, { onDelete: "cascade" })
		.notNull(),
	senderId: uuid("sender_id")
		.references(() => users.id, { onDelete: "cascade" })
		.notNull(),

	content: text("content").notNull(),

	createdAt: timestamp("created_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
});

export const conversationReads = pgTable("conversation_reads", {
	id: uuid("id").primaryKey().defaultRandom(),
	conversationId: uuid("conversation_id")
		.references(() => conversations.id, { onDelete: "cascade" })
		.notNull(),
	userId: uuid("user_id")
		.references(() => users.id, { onDelete: "cascade" })
		.notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
});

export const projects = pgTable("projects", {
	id: uuid("id").primaryKey().defaultRandom(),
	name: text("name").notNull(),
	description: text("description"),
	type: projectType("type").default("private").notNull(),
	ownerId: uuid("owner_id")
		.references(() => users.id, { onDelete: "cascade" })
		.notNull(),
	repoUrl: text("repo_url"),
	languages: json("languages").$type<string[]>().default([]),
	conversationId: uuid("conversation_id")
		.references(() => conversations.id, { onDelete: "cascade" }),
	createdAt: timestamp("created_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true })
});


// Types
export type DBUser = typeof users.$inferSelect;
export type DBNewUser = typeof users.$inferInsert;

export type DBConversation = typeof conversations.$inferSelect;
export type DBNewConversation = typeof conversations.$inferInsert;

export type DBConversationParticipant = typeof conversationParticipants.$inferSelect;
export type DBNewConversationParticipant = typeof conversationParticipants.$inferInsert;

export type DBMessage = typeof messages.$inferSelect;
export type DBNewMessage = typeof messages.$inferInsert;
export type DBMessageWithSender = DBMessage & {
	sender: {
		id: string;
		name: string | null;
		imageUrl: string | null;
		githubUsername: string | null;
	};
};

export type DBConversationRead = typeof conversationReads.$inferSelect;
export type DBNewConversationRead = typeof conversationReads.$inferInsert;

export type DBProject = typeof projects.$inferSelect;
export type DBNewProject = typeof projects.$inferInsert;