export type DMParticipant = {
	id: string;
	name: string | null;
	githubUsername: string;
	imageUrl: string | null;
};

export type DMLatestMessage = {
	id: string;
	content: string;
	senderId: string;
	createdAt: string;
};

export type DMConversation = {
	id: string;
	type: "dm" | "group";
	name: string | null;
	createdBy: string;
	createdAt: string;
	updatedAt: string;
	participants: DMParticipant[];
	latestMessage: DMLatestMessage | null;
};
