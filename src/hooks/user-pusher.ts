import { useEffect } from "react";
import { DMMessage } from "@/types/db-customs";
import { pusherClient } from "@/lib/pusher-client";

export function useConversationChannel(
	conversationId: string,
	onMessage: (msg: DMMessage) => void
) {
	useEffect(() => {
		if (!conversationId) return;

		const channelName = `conversation-${conversationId}`;
		const channel = pusherClient.subscribe(channelName);

		channel.bind("new-message", onMessage);

		return () => {
			channel.unbind("new-message", onMessage);
		};
	}, [conversationId, onMessage]);
}
