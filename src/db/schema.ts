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

	settings: json("settings").$type<Record<string, any>>().default({}),


	createdAt: timestamp("created_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
});
;

export const conversationType = pgEnum("conversation_type", ["dm", "group"]);

export const conversations = pgTable("conversations", {
	id: uuid("id").primaryKey().defaultRandom(),

	type: conversationType("type").notNull(),
	name: text("name"),
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
