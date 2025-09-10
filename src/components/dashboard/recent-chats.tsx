import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { MessageCircle, Hash } from "lucide-react";

interface RecentChatsProps {
    onStartPrivateChat: (userId: string) => void;
    onSectionChange: (section: string) => void;
}

const mockRecentChats = [
	{
		id: "general",
		name: "general",
		type: "channel",
		lastMessage: "Looking forward to the new React features!",
		lastMessageTime: "2m ago",
		unreadCount: 3,
		participants: 47,
	},
	{
		id: "javascript",
		name: "javascript",
		type: "channel",
		lastMessage: "Anyone tried the new Node.js 20 features?",
		lastMessageTime: "15m ago",
		unreadCount: 1,
		participants: 32,
	},
	{
		id: "sarah",
		name: "Sarah Chen",
		type: "private",
		lastMessage: "Thanks for the code review feedback!",
		lastMessageTime: "1h ago",
		unreadCount: 0,
		avatar:
			"https://images.unsplash.com/photo-1494790108755-2616b5b2aca3?w=400&h=400&fit=crop&crop=face",
	},
	{
		id: "mike",
		name: "Mike Rodriguez",
		type: "private",
		lastMessage: "Want to collaborate on that API project?",
		lastMessageTime: "2h ago",
		unreadCount: 2,
		avatar:
			"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
	},
];

export function RecentChats({ onStartPrivateChat, onSectionChange }: RecentChatsProps) {
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
				{mockRecentChats.map((chat) => (
					<div
						key={chat.id}
						className="flex items-center space-x-3 p-3 rounded-lg hover:bg-purple-50 cursor-pointer transition-colors border border-transparent hover:border-purple-200"
						onClick={() => {
							if (chat.type === "private") {
								onStartPrivateChat(chat.id);
							} else {
								onSectionChange("chat");
							}
						}}
					>
						{chat.type === "channel" ? (
							<div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center">
								<Hash className="w-5 h-5 text-white" />
							</div>
						) : (
							<Avatar className="w-10 h-10">
								<AvatarImage src={chat.avatar} />
								<AvatarFallback>{chat.name[0]}</AvatarFallback>
							</Avatar>
						)}
						<div className="flex-1 min-w-0">
							<div className="flex items-center justify-between">
								<h4 className="truncate font-medium text-gray-900">
									{chat.type === "channel" ? `#${chat.name}` : chat.name}
								</h4>
								<div className="flex items-center space-x-2">
									{chat.unreadCount > 0 && (
										<Badge className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0 text-xs">
											{chat.unreadCount}
										</Badge>
									)}
									<span className="text-xs text-gray-500">
										{chat.lastMessageTime}
									</span>
								</div>
							</div>
							<p className="text-sm text-gray-600 truncate">
								{chat.lastMessage}
							</p>
							{chat.type === "channel" && (
								<p className="text-xs text-gray-500">
									{chat.participants} members
								</p>
							)}
						</div>
					</div>
				))}
			</CardContent>
		</Card>
	);
}