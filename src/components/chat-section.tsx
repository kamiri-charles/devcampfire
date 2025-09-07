import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { ScrollArea } from "./ui/scroll-area";
import { Card } from "./ui/card";
import { Send, Hash, Code2, Copy } from "lucide-react";

interface ChatSectionProps {
	user: any;
}

const mockMessages = [
	{
		id: 1,
		user: {
			name: "Sarah Chen",
			login: "sarahc",
			avatar:
				"https://images.unsplash.com/photo-1494790108755-2616b5b2aca3?w=400&h=400&fit=crop&crop=face",
		},
		content: "Anyone have experience with React Server Components?",
		timestamp: "2 hours ago",
		type: "text",
	},
	{
		id: 2,
		user: {
			name: "Mike Rodriguez",
			login: "mikecodes",
			avatar:
				"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
		},
		content: `const ServerComponent = async () => {
  const data = await fetch('/api/data');
  return <div>{data.message}</div>;
};`,
		timestamp: "1 hour ago",
		type: "code",
		language: "jsx",
	},
	{
		id: 3,
		user: {
			name: "Alex Developer",
			login: "devuser",
			avatar:
				"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
		},
		content:
			"Thanks! That's exactly what I was looking for. The async component pattern is really powerful.",
		timestamp: "45 minutes ago",
		type: "text",
	},
	{
		id: 4,
		user: {
			name: "Emma Wilson",
			login: "emmacodes",
			avatar:
				"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
		},
		content:
			"Working on a new AI-powered code review tool. Would love some beta testers! 🚀",
		timestamp: "30 minutes ago",
		type: "text",
	},
];

export default function ChatSection({ user }: ChatSectionProps) {
	const [currentChannel, setCurrentChannel] = useState("general");
	const [message, setMessage] = useState("");
	const [messages, setMessages] = useState(mockMessages);

	const handleSendMessage = () => {
		if (!message.trim()) return;

		const newMessage = {
			id: Date.now(),
			user: {
				name: user.name,
				login: user.login,
				avatar: user.avatar_url,
			},
			content: message,
			timestamp: "Just now",
			type: "text" as const,
		};

		setMessages([...messages, newMessage]);
		setMessage("");
	};

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSendMessage();
		}
	};

	return (
		<div className="flex-1 flex flex-col h-screen">
			{/* Channel Header */}
			<div className="p-4 border-b border-border bg-card/50 backdrop-blur-sm">
				<div className="flex items-center space-x-2">
					<div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center">
						<Hash className="w-4 h-4 text-white" />
					</div>
					<h2 className="capitalize text-lg font-medium">{currentChannel}</h2>
					<Badge className="ml-auto bg-gradient-to-r from-purple-100 to-purple-200 text-purple-700 border-0">
						{messages.length + 47} members
					</Badge>
				</div>
				<p className="text-sm text-muted-foreground mt-1">
					General discussion and community updates
				</p>
			</div>

			{/* Messages */}
			<ScrollArea className="flex-1 p-4">
				<div className="space-y-4">
					{messages.map((msg) => (
						<div key={msg.id} className="flex space-x-3">
							<Avatar className="w-8 h-8">
								<AvatarImage src={msg.user.avatar} />
								<AvatarFallback>{msg.user.name[0]}</AvatarFallback>
							</Avatar>
							<div className="flex-1 min-w-0">
								<div className="flex items-baseline space-x-2 mb-1">
									<span className="text-sm">{msg.user.name}</span>
									<span className="text-xs text-muted-foreground">
										@{msg.user.login}
									</span>
									<span className="text-xs text-muted-foreground">
										{msg.timestamp}
									</span>
								</div>
								{msg.type === "code" ? (
									<Card className="p-3 bg-gray-50 border border-gray-200">
										<div className="flex items-center justify-between mb-2">
											<div className="flex items-center space-x-2">
												<Code2 className="w-4 h-4 text-purple-600" />
												<Badge className="text-xs bg-purple-100 text-purple-700 border-0">
													{msg.language}
												</Badge>
											</div>
											<Button
												variant="ghost"
												size="sm"
												className="h-6 px-2 hover:bg-purple-100"
											>
												<Copy className="w-3 h-3" />
											</Button>
										</div>
										<pre className="text-sm overflow-x-auto text-gray-800">
											<code>{msg.content}</code>
										</pre>
									</Card>
								) : (
									<p className="text-sm text-gray-800">{msg.content}</p>
								)}
							</div>
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
						placeholder={`Message #${currentChannel}`}
						className="flex-1 bg-white/80"
					/>
					<Button
						onClick={handleSendMessage}
						className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
					>
						<Send className="w-4 h-4" />
					</Button>
				</div>
				<div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
					<span>Press Enter to send, Shift+Enter for new line</span>
					<Separator orientation="vertical" className="h-3" />
					<span>Use ```code``` for syntax highlighting</span>
				</div>
			</div>
		</div>
	);
}
