import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { MessageCircle, Hash, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState, Dispatch, SetStateAction } from "react";
import { DMConversation } from "@/types/db-customs";
import { DBConversation, DBMessage, DBMessageWithSender } from "@/db/schema";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { formatDistanceToNow } from "date-fns";

interface RecentChatsProps {
    onStartPrivateChat: (userId: string) => void;
    onSectionChange: (section: string) => void;
	setSelectedRoom: Dispatch<SetStateAction<DBConversation | null>>;
}

interface RecentMessage {
	type: "dm" | "room" | "channel";
	message: DMConversation;
}


export function RecentChats({ onStartPrivateChat, onSectionChange, setSelectedRoom }: RecentChatsProps) {
	//const max_recent_chats = 5;
	const [dms, setDms] = useState<DMConversation[]>([]);
	const [loadingDms, setLoadingDms] = useState(true);
	const { data: session } = useSession();
	const [recentMessages, setRecentMessages] = useState<RecentMessage[]>([]);



	useEffect(() => {
		if (!session?.user?.dbId) return;

		const fetchDms = async () => {
			if (!session.user.dbId) return;
			try {
				const res = await fetch(
					`/api/db/users/conversations/${session.user.dbId}?limit=5`
				);
				if (res.ok) {
					const data = await res.json();
					setDms(data);
				}
			} catch (e) {
				console.error(e);
			} finally {
				setLoadingDms(false);
			}
		};
		fetchDms();
	}, [session?.user.dbId]);

	useEffect(() => {
		if (dms.length === 0) return;
		dms.forEach((dm) => {
			setRecentMessages((prev) => [
				...prev,
				{ type: "dm", message: dm }
			]);
		});
	}, [dms]);

	if (session?.user.dbId) return null;

	if (loadingDms) {
		return (
			<div className="flex items-center justify-center h-32">
				<Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
			</div>
		);
	}


  return (
		<Card className="h-fit">
			<CardHeader className="flex flex-row items-center justify-between">
				<div>
					<CardTitle className="flex items-center space-x-2">
						<MessageCircle className="w-5 h-5 text-purple-500" />
						<span>Recent Chats</span>
					</CardTitle>
					<CardDescription>Your latest conversations</CardDescription>
				</div>
			</CardHeader>
			<CardContent className="space-y-4">
				{recentMessages.map((chat) => {
					// Get other participant for DM
					const otherParticipant = chat.type === "dm"
						? chat.message.participants.find((p) => p.id !== session?.user.dbId)
						: null;
					return (
						<div
							key={chat.message.id}
							className="flex items-center space-x-3 p-3 rounded-lg hover:bg-purple-50 cursor-pointer transition-colors border border-transparent hover:border-purple-200"
							onClick={() => {
								if (chat.type === "dm") {
									onStartPrivateChat(chat.message.id);
									onSectionChange("dms");
								} else {
									setSelectedRoom(null);
									onSectionChange("room");
								}
							}}
						>
							{chat.type === "channel" ? (
								<div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center">
									<Hash className="w-5 h-5 text-white" />
								</div>
							) : (
								<Avatar className="w-10 h-10">
									{/* Get avatar src from other participant */}
									<AvatarImage
										src={otherParticipant?.imageUrl || "favicon.ico"}
									/>
									<AvatarFallback>
										<FontAwesomeIcon icon={faUser} />
									</AvatarFallback>
								</Avatar>
							)}
							<div className="flex-1 min-w-0">
								<div className="flex items-center justify-between">
									<h4 className="truncate font-medium text-gray-900">
										{chat.type === "channel"
											? `#${chat.message.name}`
											: chat.message.name}
									</h4>
									<div className="flex items-center space-x-2">
										{chat.message.unreadCount > 0 && (
											<Badge className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0 text-xs">
												{chat.message.unreadCount}
											</Badge>
										)}
										<span className="text-xs text-gray-500">
											{chat.message.latestMessage
												? `${formatDistanceToNow(
														new Date(chat.message.latestMessage.createdAt),
														{ addSuffix: true }
												  )}`
												: "No messages yet"}
										</span>
									</div>
								</div>
								<p className="text-sm text-gray-600 truncate">
									{chat.message.latestMessage?.content || "No messages yet"}
								</p>
								{chat.type === "channel" && (
									<p className="text-xs text-gray-500">"room" members</p>
								)}
							</div>
						</div>
					);
})}
			</CardContent>
		</Card>
	);
}