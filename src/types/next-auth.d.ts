// types/next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
	interface Session {
		user: {
			id: string;
			name?: string | null;
			email?: string | null;
			image?: string | null;
			username?: string;
			bio?: string;
			followers?: number;
			following?: number;
			public_repos?: number;
		};
		accessToken?: string;
	}

	interface User {
		id: string;
		name?: string | null;
		email?: string | null;
		image?: string | null;
		username?: string;
		bio?: string;
		followers?: number;
		following?: number;
		public_repos?: number;
	}
}

declare module "next-auth/jwt" {
	interface JWT {
		id?: string;
		username?: string;
		bio?: string;
		followers?: number;
		following?: number;
		public_repos?: number;
		accessToken?: string;
	}
}
