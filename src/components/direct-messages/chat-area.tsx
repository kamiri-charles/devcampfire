import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { ScrollArea } from "../ui/scroll-area";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
	ArrowLeft,
	MoreVertical,
	Send,
	Loader2,
} from "lucide-react";
import { DMConversation, DMMessage } from "@/types/db-customs";
import { useSession } from "next-auth/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { useConversationChannel } from "@/hooks/user-pusher";

interface ChatAreaProps {
	conversationId: string;
	setConversationId: Dispatch<SetStateAction<string | null>>;
	currentConversation: DMConversation;
}

export function ChatArea({
	conversationId,
	setConversationId,
	currentConversation,
}: ChatAreaProps) {
	const { data: session } = useSession();
	const [messages, setMessages] = useState<DMMessage[]>([]);
	const [loadingMessages, setLoadingMessages] = useState(true);
	const [message, setMessage] = useState("");
	const [sendingMessage, setSendingMessage] = useState(false);
	const scrollAreaRef = useRef<HTMLDivElement | null>(null);
	const messagesEndRef = useRef<HTMLDivElement | null>(null);
	const [isNearBottom, setIsNearBottom] = useState(true);

	useEffect(() => {
		const fetchMessages = async () => {
			try {
				const res = await fetch(`/api/db/conversations/${conversationId}/messages`);
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
		if (conversationId) {
			fetchMessages();
		}
	}, []);

	useEffect(() => {
		if (!conversationId || messages.length === 0) return;

		const markAsRead = async () => {
			try {
				await fetch(`/api/db/conversations/${conversationId}/read`, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					
				});
			} catch (err) {
				console.error("Error marking messages as read:", err);
			}
		};

		markAsRead();
	}, [conversationId, messages]);


	useEffect(() => {
		const el = scrollAreaRef.current;
		if (!el) return;

		el.addEventListener("scroll", handleScroll);
		return () => el.removeEventListener("scroll", handleScroll);
	}, []);

	useEffect(() => {
		if (messagesEndRef.current && isNearBottom) {
			messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
		}
	}, [messages, isNearBottom]);

	const handleSendMessage = async () => {
		if (!message.trim() || !conversationId) return;

		const content = message.trim();

		try {
			setSendingMessage(true);
			const res = await fetch(`/api/db/messages/dms/${conversationId}`, {
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
		} finally {
			setMessage("");
			setSendingMessage(false);
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

	const handleScroll = () => {
		const el = scrollAreaRef.current;
		if (!el) return;

		const threshold = 100; // px from bottom
		const position = el.scrollTop + el.clientHeight;
		const height = el.scrollHeight;

		setIsNearBottom(position >= height - threshold);
	};

	useConversationChannel(conversationId, (message) => {
		setMessages((prev) => [...prev, message]);
	});

	if (!userId) return null;

	if (loadingMessages)
		return (
			<div className="flex-1">
				<div className="flex flex-col items-center justify-center bg-white h-80">
					<Loader2 className="animate-spin" />
					<p className="text-muted-foreground">Loading messages...</p>
				</div>
			</div>
		);

	return (
		<div
			className={`flex-1 flex flex-col h-[90vh] ${
				conversationId ? "flex" : "hidden md:flex"
			}`}
		>
			{/* Chat Header */}
			<div className="p-4 border-b border-border bg-card/50 backdrop-blur-sm">
				<div className="flex items-center justify-between">
					<div className="flex items-center space-x-3">
						<Button
							variant="ghost"
							size="sm"
							onClick={() => setConversationId(null)}
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
							<h3>
								{otherParticipant?.githubUsername ||
									otherParticipant?.name ||
									"friend"}
							</h3>
							<p className="text-sm text-muted-foreground">
								{otherParticipant?.status === "online" ? "Online" : ""}
							</p>
						</div>
					</div>
					<div className="flex items-center space-x-2">
						<Button variant="ghost" size="sm" className="cursor-pointer">
							<MoreVertical className="w-4 h-4" />
						</Button>
					</div>
				</div>
			</div>

			{/* Messages */}
			<div className="flex-1 overflow-hidden" ref={scrollAreaRef}>
				<ScrollArea className="h-full p-4">
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
						<div ref={messagesEndRef} />
					</div>
				</ScrollArea>
			</div>

			{!isNearBottom && (
				<Button
					size="sm"
					className="absolute bottom-20 right-4 shadow"
					onClick={() => {
						messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
					}}
				>
					New messages ↓
				</Button>
			)}

			{/* Message Input */}
			<div className="p-4 border-t border-border bg-card/50 backdrop-blur-sm">
				<div className="flex space-x-2">
					<Input
						value={message}
						onChange={(e) => setMessage(e.target.value)}
						onKeyDown={handleKeyPress}
						placeholder={`Message ${
							otherParticipant?.name ||
							otherParticipant?.githubUsername ||
							"user"
						}...`}
						className="flex-1"
						disabled={sendingMessage}
					/>
					{!sendingMessage ? (
						<Button
						onClick={handleSendMessage}
						className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
					>
						<Send className="w-4 h-4" />
					</Button>
					) : (
						<Button disabled className="bg-gradient-to-r from-purple-500 to-purple-600">
							<Loader2 className="w-4 h-4 animate-spin" />
						</Button>
					)}
				</div>
			</div>
		</div>
	);
}
