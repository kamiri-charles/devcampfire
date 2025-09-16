import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
} from "../ui/card";
import { Badge } from "../ui/badge";
import { MessageCircle, Hash, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState, Dispatch, SetStateAction } from "react";
import { DMConversation } from "@/types/db-customs";
import { DBConversation } from "@/db/schema";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { formatDistanceToNow } from "date-fns";

interface RecentChatsProps {
	handleOpenDM: (conversationId: string) => void;
	setCurrentSection: Dispatch<SetStateAction<string>>;
	setSelectedRoom: Dispatch<SetStateAction<DBConversation | null>>;
}

export function RecentChats({
	handleOpenDM,
	setCurrentSection,
	setSelectedRoom,
}: RecentChatsProps) {
	const [recentDMs, setRecentDMs] = useState<DMConversation[]>([]);
	const [loadingDMs, setLoadingDMs] = useState(true);
	const { data: session } = useSession();

	useEffect(() => {
		if (!session?.user?.dbId) return;

		const fetchDms = async () => {
			if (!session.user.dbId) return;
			try {
				const res = await fetch("/api/db/conversations/dms?limit=5");
				if (res.ok) {
					const data = await res.json();
					setRecentDMs(data);
				}
			} catch (e) {
				console.error(e);
			} finally {
				setLoadingDMs(false);
			}
		};
		fetchDms();
	}, [session?.user.dbId]);

	const displayCardContent = () => {
		if (loadingDMs) {
			return (
				<div className="flex justify-center items-center h-40">
					<Loader2 className="animate-spin" />
				</div>
			);
		} else if (recentDMs.length === 0) {
			return <div className="text-center text-gray-500">No recent chats</div>;
		} else {
			return (
				<>
					{recentDMs.map((recentDM) => {
						const otherParticipant =
							recentDM.type === "dm"
								? recentDM.participants.find((p) => p.id !== session?.user.dbId)
								: null;

						return (
							<div
								key={recentDM.id}
								className="flex items-center space-x-3 p-3 rounded-lg hover:bg-purple-50 cursor-pointer transition-colors border border-transparent hover:border-purple-200"
								onClick={() => {
									if (recentDM.type === "dm") {
										handleOpenDM(recentDM.id);
										setCurrentSection("dms");
									} else {
										setSelectedRoom(null);
										setCurrentSection("room");
									}
								}}
							>
								<Avatar className="w-10 h-10">
									<AvatarImage
										src={otherParticipant?.imageUrl || "favicon.ico"}
									/>
									<AvatarFallback>
										<FontAwesomeIcon icon={faUser} />
									</AvatarFallback>
								</Avatar>

								<div className="flex-1 min-w-0">
									<div className="flex items-center justify-between">
										<h4 className="truncate font-medium text-gray-900">
											{otherParticipant?.githubUsername ||
												otherParticipant?.name ||
												"user"}
										</h4>
										<div className="flex items-center space-x-2">
											{recentDM.unreadCount > 0 && (
												<Badge className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0 text-xs">
													{recentDM.unreadCount}
												</Badge>
											)}
											<span className="text-xs text-gray-500">
												{recentDM.latestMessage
													? `${formatDistanceToNow(
															new Date(recentDM.latestMessage.createdAt),
															{ addSuffix: true }
													  )}`
													: "No messages yet"}
											</span>
										</div>
									</div>
									<p className="text-sm text-gray-600 truncate">
										{recentDM.latestMessage?.content || "No messages yet"}
									</p>
								</div>
							</div>
						);
					})}
				</>
			);
		}
	};

	if (!session?.user.dbId) return null;

	return (
		<Card className="h-fit min-h-90">
			<CardHeader className="flex flex-row items-center justify-between">
				<div>
					<CardTitle className="flex items-center space-x-2">
						<MessageCircle className="w-5 h-5 text-purple-500" />
						<span>Recent Chats</span>
					</CardTitle>
					<CardDescription>Your latest conversations</CardDescription>
				</div>
			</CardHeader>
			<CardContent className="space-y-4">{displayCardContent()}</CardContent>
		</Card>
	);
}