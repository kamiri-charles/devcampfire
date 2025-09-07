import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import { Badge } from "./ui/badge";
import {
	Send,
	ArrowLeft,
	Phone,
	Video,
	MoreVertical,
	Search,
} from "lucide-react";

interface PrivateMessagingProps {
	user: any;
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

const mockMessages = {
	sarah: [
		{
			id: 1,
			senderId: "sarah",
			senderName: "Sarah Chen",
			content:
				"Hey! I saw your latest commit on the React components library. Really clean implementation!",
			timestamp: "2 hours ago",
			type: "text",
		},
		{
			id: 2,
			senderId: "me",
			senderName: "You",
			content:
				"Thanks! I tried to keep it simple and reusable. Did you get a chance to test it?",
			timestamp: "1 hour ago",
			type: "text",
		},
		{
			id: 3,
			senderId: "sarah",
			senderName: "Sarah Chen",
			content:
				"Yes! Everything works perfectly. Just one small suggestion - maybe add TypeScript interfaces for the props?",
			timestamp: "1 hour ago",
			type: "text",
		},
		{
			id: 4,
			senderId: "me",
			senderName: "You",
			content:
				"Great idea! I'll add those interfaces this afternoon. Thanks for the review! 🙏",
			timestamp: "45 minutes ago",
			type: "text",
		},
	],
	mike: [
		{
			id: 1,
			senderId: "mike",
			senderName: "Mike Rodriguez",
			content:
				"Hey! I've been working on a microservices architecture for a new project. Want to collaborate?",
			timestamp: "3 hours ago",
			type: "text",
		},
		{
			id: 2,
			senderId: "mike",
			senderName: "Mike Rodriguez",
			content: "It's using Node.js, Docker, and AWS. Right up your alley!",
			timestamp: "2 hours ago",
			type: "text",
		},
	],
};

export default function PrivateMessaging({
	user,
	chatId,
	onBack,
}: PrivateMessagingProps) {
	const [selectedChat, setSelectedChat] = useState(chatId || "sarah");
	const [message, setMessage] = useState("");
	const [searchQuery, setSearchQuery] = useState("");

	const currentConversation = mockConversations.find(
		(conv) => conv.id === selectedChat
	);
	const currentMessages =
		mockMessages[selectedChat as keyof typeof mockMessages] || [];

	const filteredConversations = mockConversations.filter((conv) =>
		conv.name.toLowerCase().includes(searchQuery.toLowerCase())
	);

	const handleSendMessage = () => {
		if (!message.trim()) return;
		// In a real app, this would send the message
		setMessage("");
	};

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSendMessage();
		}
	};

	return (
		<div className="flex-1 flex h-screen bg-gradient-to-br from-purple-50 to-orange-50">
			{/* Conversations List - Hidden on mobile when chat selected */}
			<div
				className={`w-full md:w-80 border-r border-border bg-card ${
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

			{/* Chat Area */}
			{selectedChat && currentConversation && (
				<div
					className={`flex-1 flex flex-col ${
						selectedChat ? "flex" : "hidden md:flex"
					}`}
				>
					{/* Chat Header */}
					<div className="p-4 border-b border-border bg-card/50 backdrop-blur-sm">
						<div className="flex items-center justify-between">
							<div className="flex items-center space-x-3">
								<Button
									variant="ghost"
									size="sm"
									onClick={() => setSelectedChat("")}
									className="md:hidden"
								>
									<ArrowLeft className="w-4 h-4" />
								</Button>
								<div className="relative">
									<Avatar className="w-10 h-10">
										<AvatarImage src={currentConversation.avatar} />
										<AvatarFallback>
											{currentConversation.name[0]}
										</AvatarFallback>
									</Avatar>
									{currentConversation.online && (
										<div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
									)}
								</div>
								<div>
									<h3>{currentConversation.name}</h3>
									<p className="text-sm text-muted-foreground">
										{currentConversation.online ? "Online" : "Last seen 1d ago"}
									</p>
								</div>
							</div>
							<div className="flex items-center space-x-2">
								<Button variant="ghost" size="sm">
									<Phone className="w-4 h-4" />
								</Button>
								<Button variant="ghost" size="sm">
									<Video className="w-4 h-4" />
								</Button>
								<Button variant="ghost" size="sm">
									<MoreVertical className="w-4 h-4" />
								</Button>
							</div>
						</div>
					</div>

					{/* Messages */}
					<ScrollArea className="flex-1 p-4">
						<div className="space-y-4">
							{currentMessages.map((msg) => (
								<div
									key={msg.id}
									className={`flex ${
										msg.senderId === "me" ? "justify-end" : "justify-start"
									}`}
								>
									<div
										className={`max-w-xs md:max-w-md ${
											msg.senderId === "me" ? "order-2" : "order-1"
										}`}
									>
										<div
											className={`p-3 rounded-lg ${
												msg.senderId === "me"
													? "bg-gradient-to-r from-purple-500 to-purple-600 text-white"
													: "bg-muted"
											}`}
										>
											<p className="text-sm">{msg.content}</p>
										</div>
										<p
											className={`text-xs text-muted-foreground mt-1 ${
												msg.senderId === "me" ? "text-right" : "text-left"
											}`}
										>
											{msg.timestamp}
										</p>
									</div>
									{msg.senderId !== "me" && (
										<Avatar className="w-8 h-8 order-1 mr-2">
											<AvatarImage src={currentConversation.avatar} />
											<AvatarFallback>
												{currentConversation.name[0]}
											</AvatarFallback>
										</Avatar>
									)}
								</div>
							))}
						</div>
					</ScrollArea>

					{/* Message Input */}
					<div className="p-4 border-t border-border bg-card/50 backdrop-blur-sm">
						<div className="flex space-x-2">
							<Input
								value={message}
								onChange={(e) => setMessage(e.target.value)}
								onKeyPress={handleKeyPress}
								placeholder={`Message ${currentConversation.name}...`}
								className="flex-1"
							/>
							<Button
								onClick={handleSendMessage}
								className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
							>
								<Send className="w-4 h-4" />
							</Button>
						</div>
					</div>
				</div>
			)}

			{/* Empty State (when no chat selected on desktop) */}
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
