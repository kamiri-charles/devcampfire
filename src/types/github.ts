export type GitHubUserLite = {
	id: number;
	username: string;
	avatar: string;
};

export type GitHubConnections = {
	followers: GitHubUserLite[];
	following: GitHubUserLite[];
	mutuals: GitHubUserLite[];
};

export type GitHubUserEnriched = GitHubUserLite & {
	name: string | null;
	bio: string | null;
};
