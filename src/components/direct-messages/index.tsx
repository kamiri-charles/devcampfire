import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { ScrollArea } from "../ui/scroll-area";
import { Badge } from "../ui/badge";
import { Send, ArrowLeft, Search } from "lucide-react";
import { ChatArea } from "./chat-area";

interface PrivateMessagingProps {
	chatId?: string;
	onBack: () => void;
}

const mockConversations = [
	{
		id: "sarah",
		name: "Sarah Chen",
		avatar:
			"https://images.unsplash.com/photo-1494790108755-2616b5b2aca3?w=400&h=400&fit=crop&crop=face",
		lastMessage: "Thanks for the code review feedback!",
		lastMessageTime: "1h ago",
		unreadCount: 0,
		online: true,
	},
	{
		id: "mike",
		name: "Mike Rodriguez",
		avatar:
			"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
		lastMessage: "Want to collaborate on that API project?",
		lastMessageTime: "2h ago",
		unreadCount: 2,
		online: true,
	},
	{
		id: "emma",
		name: "Emma Wilson",
		avatar:
			"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
		lastMessage: "The ML model is working great!",
		lastMessageTime: "1d ago",
		unreadCount: 0,
		online: false,
	},
];

export default function DirectMessages({
	chatId,
	onBack,
}: PrivateMessagingProps) {
	const [selectedChat, setSelectedChat] = useState(chatId);
	const [searchQuery, setSearchQuery] = useState("");

	const currentConversation = mockConversations.find(
		(conv) => conv.id === selectedChat
	);

	const filteredConversations = mockConversations.filter((conv) =>
		conv.name.toLowerCase().includes(searchQuery.toLowerCase())
	);


	return (
		<div className="flex-1 flex bg-gradient-to-br from-purple-50 to-orange-50">
			<div
				className={`w-full md:w-100 border-r border-border bg-card ${
					selectedChat ? "hidden md:block" : "block"
				}`}
			>
				<div className="p-4 border-b border-border">
					<div className="flex items-center justify-between mb-4">
						<h2 className="flex items-center space-x-2">
							<Button
								variant="ghost"
								size="sm"
								onClick={onBack}
								className="md:hidden"
							>
								<ArrowLeft className="w-4 h-4" />
							</Button>
							<span>Messages</span>
						</h2>
						<Badge className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0">
							{mockConversations.reduce(
								(sum, conv) => sum + conv.unreadCount,
								0
							)}
						</Badge>
					</div>
					<div className="relative">
						<Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
						<Input
							placeholder="Search conversations..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="pl-10"
						/>
					</div>
				</div>

				<ScrollArea className="flex-1">
					<div className="p-2">
						{filteredConversations.map((conversation) => (
							<div
								key={conversation.id}
								className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
									selectedChat === conversation.id
										? "bg-gradient-to-r from-purple-100 to-purple-200 border border-purple-300"
										: "hover:bg-purple-50 hover:border hover:border-purple-200 border border-transparent"
								}`}
								onClick={() => setSelectedChat(conversation.id)}
							>
								<div className="relative">
									<Avatar className="w-12 h-12">
										<AvatarImage src={conversation.avatar} />
										<AvatarFallback>{conversation.name[0]}</AvatarFallback>
									</Avatar>
									{conversation.online && (
										<div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
									)}
								</div>
								<div className="flex-1 min-w-0">
									<div className="flex items-center justify-between">
										<h3 className="truncate font-medium text-gray-900">
											{conversation.name}
										</h3>
										<div className="flex items-center space-x-1">
											{conversation.unreadCount > 0 && (
												<Badge className="bg-gradient-to-r from-orange-400 to-orange-500 text-white border-0 text-xs">
													{conversation.unreadCount}
												</Badge>
											)}
											<span className="text-xs text-gray-500">
												{conversation.lastMessageTime}
											</span>
										</div>
									</div>
									<p className="text-sm text-gray-600 truncate">
										{conversation.lastMessage}
									</p>
								</div>
							</div>
						))}
					</div>
				</ScrollArea>
			</div>

			{/* Chat area */}
			{selectedChat && currentConversation && (
				<ChatArea selectedChat={selectedChat} setSelectedChat={setSelectedChat} currentConversation={currentConversation} />
			)}

			{/* No chat selected */}
			{!selectedChat && (
				<div className="hidden md:flex flex-1 items-center justify-center bg-muted/20">
					<div className="text-center">
						<div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
							<Send className="w-8 h-8 text-white" />
						</div>
						<h3 className="mb-2">Select a conversation</h3>
						<p className="text-muted-foreground">
							Choose a conversation from the sidebar to start messaging
						</p>
					</div>
				</div>
			)}
		</div>
	);
}
