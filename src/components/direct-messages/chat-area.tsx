import { Dispatch, SetStateAction, useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { ScrollArea } from "../ui/scroll-area";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { ArrowLeft, Phone, Video, MoreVertical, Send } from "lucide-react";
import { DMConversation } from "@/types/db-customs";
import { useSession } from "next-auth/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";

interface ChatAreaProps {
	selectedChat: string;
	setSelectedChat: Dispatch<SetStateAction<string | null>>;
	currentConversation: DMConversation;
}

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

export function ChatArea({selectedChat, setSelectedChat, currentConversation}: ChatAreaProps) {
	const { data: session } = useSession();
    const [message, setMessage] = useState("");
    const currentMessages =
			mockMessages[selectedChat as keyof typeof mockMessages] || [];

    const handleSendMessage = () => {
			if (!message.trim()) return;
			setMessage("");
		};

		const handleKeyPress = (e: React.KeyboardEvent) => {
			if (e.key === "Enter" && !e.shiftKey) {
				e.preventDefault();
				handleSendMessage();
			}
		};

		const userId = session?.user?.dbId;
		const otherParticipant = currentConversation?.participants.find(
			(p) => p.id !== userId
		);

		if (!userId) return null;
  return (
		<div
			className={`flex-1 flex flex-col h-full ${
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
								<AvatarImage
									src={otherParticipant?.imageUrl || "./favicon.ico"}
								/>
								<AvatarFallback>
									<FontAwesomeIcon icon={faGithub} />
								</AvatarFallback>
							</Avatar>
							{!currentConversation && ( // TODO: Replace with real online status
								<div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
							)}
						</div>
						<div>
							<h3>{currentConversation.name}</h3>
							<p className="text-sm text-muted-foreground">
								{currentConversation ? "Online" : "Last seen 1d ago"}{" "}
								{/* TODO: *** */}
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
			<ScrollArea className="flex-1 p-4 min-h-[70vh]">
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
									<AvatarImage
										src={otherParticipant?.imageUrl || "./favicon.ico"}
									/>
									<AvatarFallback>
										<FontAwesomeIcon icon={faGithub} />
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
	);
}