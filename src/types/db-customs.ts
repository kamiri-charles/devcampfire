export type DMParticipant = {
	id: string;
	name: string | null;
	githubUsername: string;
	imageUrl: string | null;
	status: string;
};

export type DMSender = {
	id: string;
	name: string | null;
	imageUrl: string | null;
	githubUsername: string | null;
};

export type DMMessage = {
	id: string;
	content: string;
	createdAt: string;
	updatedAt: string;
	sender: DMSender;
};

export type DMConversation = {
	id: string;
	type: "dm" | "group";
	name: string | null;
	createdBy: string;
	createdAt: string;
	updatedAt: string;
	participants: DMParticipant[];
	latestMessage: DMMessage | null;
	unreadCount: number;
};

