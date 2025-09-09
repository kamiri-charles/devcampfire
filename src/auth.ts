import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github";
 
export const { handlers, signIn, signOut, auth } = NextAuth({
	providers: [
		GitHub({
			clientId: process.env.GITHUB_ID!,
			clientSecret: process.env.GITHUB_SECRET!,
			profile(profile) {
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
		async jwt({ token, profile }) {
			if (profile) {
				token.username = profile.login;
			}
			return token;
		},
		async session({ session, token }) {
			if (session.user && typeof token?.username === "string") {
				session.user.username = token.username;
			}
			return session;
		},
	},
});