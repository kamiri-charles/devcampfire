import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "../ui/badge";
import { DMConversation, DMLatestMessage, DMParticipant } from "@/types/db-customs";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { DBMessage } from "@/db/schema";
import { pusherClient } from "@/lib/pusher-client";

interface DmOverviewProps {
    conversation: DMConversation;
    dmId: string | null;
    setDmId: Dispatch<SetStateAction<string | null>>;
}

export function DmOverview({conversation, dmId, setDmId}: DmOverviewProps) {
    const [recipient, setRecipient] = useState<DMParticipant | null>(null);
    const {data: session }= useSession();

    useEffect(() => {
        if (!session?.user.dbId) return;
        const other = conversation.participants.find(
            (p) => p.id !== session?.user?.dbId
        );
        setRecipient(other || null);

		// Subscribe to recipient status updates via Pusher
		const channel = pusherClient.subscribe(`conversation-${conversation.id}`);
		channel.bind("update-conversation", (data: {id: string, latestMessage: DMLatestMessage, updatedAt: Date}) => {
			if (data.id === conversation.id) {
				conversation.latestMessage = data.latestMessage;
				conversation.updatedAt = data.updatedAt.toString();
			}
		});

		// Cleanup
		return () => {
			channel.unbind_all();
			pusherClient.unsubscribe(`conversation-${conversation.id}`);
		}


    }, [session?.user.dbId])

    
  return (
		<div
			className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
				dmId === conversation.id
					? "bg-gradient-to-r from-purple-100 to-purple-200 border border-purple-300"
					: "hover:bg-purple-50 hover:border hover:border-purple-200 border border-transparent"
			}`}
			onClick={() => setDmId(conversation.id)}
		>
			<div className="relative">
				<Avatar className="w-12 h-12">
					<AvatarImage src={recipient?.imageUrl || "./favicon.ico"} />
					<AvatarFallback>
						<FontAwesomeIcon icon={faUser} />
					</AvatarFallback>
				</Avatar>
				{recipient?.status === "online" && (
					<div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
				)}
			</div>
			<div className="flex-1 min-w-0">
				<div className="flex items-center justify-between">
					<h3 className="truncate font-medium text-gray-900">
						{recipient?.githubUsername ||
							recipient?.name ||
							"friend"}
					</h3>
					<div className="flex items-center space-x-1">
						{conversation.unreadCount > 0 && (
							<Badge className="bg-gradient-to-r from-orange-400 to-orange-500 text-white border-0 text-xs">
								{conversation.unreadCount}
							</Badge>
						)}
						<span className="text-xs text-gray-500">
							{conversation.latestMessage
								? `${formatDistanceToNow(
										new Date(conversation.latestMessage.createdAt),
										{ addSuffix: true }
								  )}`
								: "No messages yet"}
						</span>
					</div>
				</div>
				<p className="text-sm text-gray-600 truncate">
					{conversation.latestMessage ? (
						conversation.latestMessage.senderId === session?.user?.dbId ? (
							<>You: {conversation.latestMessage.content}</>
						) : (
							conversation.latestMessage.content
						)
					) : (
						"No messages yet"
					)}
				</p>
			</div>
		</div>
	);
}
