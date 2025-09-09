import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";

export const { handlers, signIn, signOut, auth } = NextAuth({
	providers: [
		GitHub({
			profile(profile) {
				// This function runs after GitHub returns the profile
				return {
					id: profile.id.toString(),
					name: profile.name || profile.login,
					email: profile.email,
					image: profile.avatar_url,
					username: profile.login,
				};
			},
		}),
	],
	callbacks: {
		async jwt({ token, user }) {
			if (user?.username) {
				token.username = user.username;
			}
			return token;
		},
		async session({ session, token }) {
			if (token?.username) {
				session.user.username = token.username;
			}
			return session;
		},
	},
});
