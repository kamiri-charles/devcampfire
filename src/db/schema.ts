import {
	pgTable,
	text,
	timestamp,
	uuid,
	pgEnum,
	json,
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
