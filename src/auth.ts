import { eq } from "drizzle-orm";
import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { db } from ".";
import { users } from "./db/schema";

export const { handlers, signIn, signOut, auth } = NextAuth({
	providers: [
		GitHub({
			profile(profile) {
				return {
					id: profile.id.toString(),
					name: profile.name || profile.login,
					email: profile.email ?? undefined,
					image: profile.avatar_url ?? undefined,
					username: profile.login,
					bio: profile.bio ?? undefined,
					followers: profile.followers ?? 0,
					following: profile.following ?? 0,
					public_repos: profile.public_repos ?? 0,
				};
			},
		}),
	],
	callbacks: {
		async signIn({ user }) {
			try {
				let [dbUser] = await db
					.select()
					.from(users)
					.where(eq(users.githubUsername, user.username as string))
					.limit(1);

				if (!dbUser) {
					[dbUser] = await db
						.insert(users)
						.values({
							githubUsername: user.username as string,
							name: user.name ?? null,
							email: user.email ?? null,
							imageUrl: user.image ?? null,
							bio: user.bio ?? null,
						})
						.returning();
				}

				user.dbId = dbUser.id;
				return true;
			} catch (e) {
				console.error("Error creating/checking user:", e);
				return true;
			}
		},

		async jwt({ token, user, account }) {
			if (user) {
				token.id = user.id;
				token.dbId = user.dbId;
				token.username = user.username;
				token.bio = user.bio;
				token.followers = user.followers;
				token.following = user.following;
				token.public_repos = user.public_repos;
			}

			if (account?.access_token) {
				token.accessToken = account.access_token;
			}

			return token;
		},

		async session({ session, token }) {
			if (session.user) {
				session.user.id = token.id as string;
				session.user.dbId = token.dbId as string;
				session.user.username = token.username as string;
				session.user.bio = token.bio as string;
				session.user.followers = token.followers as number;
				session.user.following = token.following as number;
				session.user.public_repos = token.public_repos as number;
			}

			if (token?.accessToken) {
				session.accessToken = token.accessToken as string;
			}

			return session;
		},
	},
});
