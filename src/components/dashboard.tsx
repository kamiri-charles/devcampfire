import { useState } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import {
	Bell,
	MessageCircle,
	Users,
	Github,
	Plus,
	TrendingUp,
	Hash,
	User,
	Send,
} from "lucide-react";

interface DashboardProps {
	user: any;
	onSectionChange: (section: string) => void;
	onStartPrivateChat: (userId: string) => void;
}

const mockNotifications = [
	{
		id: 1,
		type: "mention",
		title: "You were mentioned in #react",
		message: "Sarah Chen mentioned you in a discussion about hooks",
		time: "5m ago",
		avatar:
			"https://images.unsplash.com/photo-1494790108755-2616b5b2aca3?w=400&h=400&fit=crop&crop=face",
	},
	{
		id: 2,
		type: "message",
		title: "New private message",
		message: "Mike Rodriguez sent you a message",
		time: "12m ago",
		avatar:
			"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
	},
	{
		id: 3,
		type: "project",
		title: "Collaboration invite",
		message: "Emma Wilson invited you to join 'AI Code Assistant'",
		time: "1h ago",
		avatar:
			"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
	},
];

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

const mockTrendingTopics = [
	{ name: "React Server Components", posts: 23 },
	{ name: "TypeScript 5.0", posts: 18 },
	{ name: "AI Code Generation", posts: 15 },
	{ name: "Web3 Development", posts: 12 },
];

export default function Dashboard({
	user,
	onSectionChange,
	onStartPrivateChat,
}: DashboardProps) {

	if (!user) return null;
	
	return (
		<div className="flex-1 p-4 md:p-6 overflow-y-auto bg-gradient-to-br from-purple-50 to-orange-50">
			<div className="max-w-7xl mx-auto space-y-6">
				{/* Welcome Header */}
				<div className="mb-8">
					<h1 className="text-2xl md:text-3xl bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent">
						Welcome back, {user.name.split(" ")[0]}! 👋
					</h1>
					<p className="text-muted-foreground mt-2">
						Here's what's happening in your developer community
					</p>
				</div>

				{/* Stats Cards */}
				<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
					<Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
						<CardContent className="p-4">
							<div className="flex items-center space-x-2">
								<MessageCircle className="w-5 h-5" />
								<div>
									<p className="text-sm opacity-90">Messages</p>
									<p className="text-xl font-semibold">127</p>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card className="bg-gradient-to-br from-cyan-500 to-cyan-600 text-white border-0">
						<CardContent className="p-4">
							<div className="flex items-center space-x-2">
								<Users className="w-5 h-5" />
								<div>
									<p className="text-sm opacity-90">Connections</p>
									<p className="text-xl font-semibold">45</p>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-0">
						<CardContent className="p-4">
							<div className="flex items-center space-x-2">
								<Github className="w-5 h-5" />
								<div>
									<p className="text-sm opacity-90">Projects</p>
									<p className="text-xl font-semibold">{user.public_repos}</p>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0">
						<CardContent className="p-4">
							<div className="flex items-center space-x-2">
								<TrendingUp className="w-5 h-5" />
								<div>
									<p className="text-sm opacity-90">Reputation</p>
									<p className="text-xl font-semibold">2.4k</p>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					{/* Recent Chats */}
					<div className="lg:col-span-2">
						<Card className="h-fit">
							<CardHeader className="flex flex-row items-center justify-between">
								<div>
									<CardTitle className="flex items-center space-x-2">
										<MessageCircle className="w-5 h-5 text-purple-500" />
										<span>Recent Chats</span>
									</CardTitle>
									<CardDescription>Your latest conversations</CardDescription>
								</div>
								<Button
									variant="outline"
									size="sm"
									onClick={() => onSectionChange("chat")}
								>
									View All
								</Button>
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
													{chat.type === "channel"
														? `#${chat.name}`
														: chat.name}
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
					</div>

					{/* Right Sidebar - Better layout for larger screens */}
					<div className="space-y-6 lg:h-fit">
						{/* Notifications */}
						<Card className="lg:min-h-[300px]">
							<CardHeader>
								<CardTitle className="flex items-center space-x-2">
									<Bell className="w-5 h-5 text-orange-500" />
									<span>Notifications</span>
									<Badge className="bg-gradient-to-r from-orange-400 to-orange-500 text-white border-0">
										{mockNotifications.length}
									</Badge>
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-3">
								{mockNotifications.map((notification) => (
									<div
										key={notification.id}
										className="flex items-start space-x-3 p-2 rounded-lg hover:bg-orange-50 cursor-pointer border border-transparent hover:border-orange-200 transition-colors"
									>
										<Avatar className="w-8 h-8">
											<AvatarImage src={notification.avatar} />
											<AvatarFallback>
												<Bell className="w-4 h-4" />
											</AvatarFallback>
										</Avatar>
										<div className="flex-1 min-w-0">
											<p className="text-sm font-medium text-gray-900">
												{notification.title}
											</p>
											<p className="text-xs text-gray-600 line-clamp-2">
												{notification.message}
											</p>
											<p className="text-xs text-gray-500 mt-1">
												{notification.time}
											</p>
										</div>
									</div>
								))}
							</CardContent>
						</Card>

						{/* Trending Topics */}
						<Card className="lg:min-h-[250px]">
							<CardHeader>
								<CardTitle className="flex items-center space-x-2">
									<TrendingUp className="w-5 h-5 text-emerald-500" />
									<span>Trending</span>
								</CardTitle>
								<CardDescription>Popular topics this week</CardDescription>
							</CardHeader>
							<CardContent className="space-y-3">
								{mockTrendingTopics.map((topic, index) => (
									<div
										key={index}
										className="flex items-center justify-between p-3 rounded-lg hover:bg-emerald-50 cursor-pointer border border-transparent hover:border-emerald-200 transition-colors"
									>
										<div className="flex items-center space-x-3">
											<div
												className={`w-3 h-3 rounded-full ${
													index === 0
														? "bg-purple-500"
														: index === 1
														? "bg-cyan-500"
														: index === 2
														? "bg-emerald-500"
														: "bg-orange-500"
												}`}
											/>
											<span className="text-sm font-medium text-gray-900">
												{topic.name}
											</span>
										</div>
										<Badge
											variant="outline"
											className="text-xs bg-white border-gray-200 text-gray-700"
										>
											{topic.posts}
										</Badge>
									</div>
								))}
							</CardContent>
						</Card>

						{/* Quick Actions */}
						<Card className="lg:min-h-[200px]">
							<CardHeader>
								<CardTitle>Quick Actions</CardTitle>
								<CardDescription>
									Get started with these common tasks
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-3">
								<Button
									className="w-full justify-start bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 h-12"
									onClick={() => onSectionChange("discovery")}
								>
									<User className="w-4 h-4 mr-3" />
									Find Developers
								</Button>
								<Button
									variant="outline"
									className="w-full justify-start h-12 bg-white hover:bg-purple-50 border-purple-200 hover:border-purple-300"
									onClick={() => onSectionChange("collaboration")}
								>
									<Plus className="w-4 h-4 mr-3" />
									Start Project
								</Button>
								<Button
									variant="outline"
									className="w-full justify-start h-12 bg-white hover:bg-orange-50 border-orange-200 hover:border-orange-300"
									onClick={() => onSectionChange("messages")}
								>
									<Send className="w-4 h-4 mr-3" />
									Send Message
								</Button>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</div>
	);
}
