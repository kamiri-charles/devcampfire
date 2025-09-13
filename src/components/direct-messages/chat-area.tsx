import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { ScrollArea } from "../ui/scroll-area";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { ArrowLeft, Phone, Video, MoreVertical, Send, Loader2 } from "lucide-react";
import { DMConversation, DMMessage } from "@/types/db-customs";
import { useSession } from "next-auth/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { pusherClient } from "@/lib/pusher-client";

interface ChatAreaProps {
	dmId: string;
	setDmId: Dispatch<SetStateAction<string | null>>;
	currentConversation: DMConversation;
}

export function ChatArea({
	dmId,
	setDmId,
	currentConversation,
}: ChatAreaProps) {
	const { data: session } = useSession();
	const [messages, setMessages] = useState<DMMessage[]>([]);
	const [loadingMessages, setLoadingMessages] = useState(true);
	const [message, setMessage] = useState("");

	const handleSendMessage = async () => {
		if (!message.trim() || !dmId) return;

		const content = message.trim();

		// Optimistic clear input
		setMessage("");

		try {
			const res = await fetch(`/api/db/messages/dms/${dmId}`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ content }),
			});

			if (!res.ok) {
				console.error("Failed to send message");
				toast.error("Failed to send message");
				return;
			}
		} catch (err) {
			console.error("Error sending message:", err);
		}
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

	useEffect(() => {
		const fetchMessages = async () => {
			try {
				const res = await fetch(`/api/db/messages/dms/${dmId}`);
				if (!res.ok) {
					console.error("Failed to fetch messages");
					return;
				}
				const data = await res.json();
				setMessages(data);
			} catch (err) {
				console.error("Error fetching messages:", err);
			} finally {
				setLoadingMessages(false);
			}
		};
		if (dmId) {
			fetchMessages();
		}
	}, []);

	useEffect(() => {
		if (!dmId) return;

		const channel = pusherClient.subscribe(`conversation-${dmId}`);

		channel.bind("message:new", (message: DMMessage) => {
			setMessages((prev) => [...prev, message]);
		});

		return () => {
			pusherClient.unsubscribe(`conversation-${dmId}`);
		};
	}, [dmId]);


	if (!userId) return null;
	
	if (loadingMessages) return (
	<div className="flex-1">
		<div className="flex flex-col items-center justify-center h-full">
			<Loader2 className="animate-spin" />
			<p className="text-muted-foreground">Loading messages...</p>
		</div>
	</div>);

	return (
		<div
			className={`flex-1 flex flex-col h-full ${
				dmId ? "flex" : "hidden md:flex"
			}`}
		>
			{/* Chat Header */}
			<div className="p-4 border-b border-border bg-card/50 backdrop-blur-sm">
				<div className="flex items-center justify-between">
					<div className="flex items-center space-x-3">
						<Button
							variant="ghost"
							size="sm"
							onClick={() => setDmId(null)}
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
							{otherParticipant?.status === "online" && (
								<div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
							)}
						</div>
						<div>
							<h3>{currentConversation.name}</h3>
							<p className="text-sm text-muted-foreground">
								{otherParticipant?.status === "online" ? "Online" : ""}
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
					{messages.map((msg) => (
						<div
							key={msg.id}
							className={`flex ${
								msg.sender.id === session.user.dbId
									? "justify-end"
									: "justify-start"
							}`}
						>
							<div
								className={`max-w-xs md:max-w-md ${
									msg.sender.id === session.user.dbId ? "order-2" : "order-1"
								}`}
							>
								<div
									className={`p-3 rounded-lg ${
										msg.sender.id === session.user.dbId
											? "bg-gradient-to-r from-purple-500 to-purple-600 text-white"
											: "bg-muted"
									}`}
								>
									<p className="text-sm">{msg.content}</p>
								</div>
								<p
									className={`text-xs text-muted-foreground mt-1 ${
										msg.sender.id === session.user.dbId
											? "text-right"
											: "text-left"
									}`}
								>
									{formatDistanceToNow(new Date(msg.createdAt), {
										addSuffix: true,
									})}
								</p>
							</div>
							{msg.sender.id !== session.user.dbId && (
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
						onKeyDown={handleKeyPress}
						placeholder={`Message ${otherParticipant?.name || otherParticipant?.githubUsername || "user"}...`}
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
