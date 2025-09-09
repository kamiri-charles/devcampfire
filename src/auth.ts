import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";

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
		async jwt({ token, user }) {
			if (user) {
				token.username = user.username;
				token.bio = user.bio;
				token.followers = user.followers;
				token.following = user.following;
				token.public_repos = user.public_repos;
			}
			return token;
		},
		async session({ session, token }) {
			if (session.user) {
				session.user.username = token.username as string;
				session.user.bio = token.bio as string;
				session.user.followers = token.followers as number;
				session.user.following = token.following as number;
				session.user.public_repos = token.public_repos as number;
			}
			return session;
		},
	},
});
