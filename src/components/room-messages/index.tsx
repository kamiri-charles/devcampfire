import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { ScrollArea } from "../ui/scroll-area";
import { Send, Hash } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DBConversation, DBMessageWithSender } from "@/db/schema";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { formatDistanceToNow } from "date-fns";

interface RoomMessagesProps {
	selectedRoom: DBConversation | null;
}

export default function RoomMessages({ selectedRoom }: RoomMessagesProps) {
	const [message, setMessage] = useState("");
	const [messages, setMessages] = useState<DBMessageWithSender[]>([]);
	const [loadingMessages, setLoadingMessages] = useState(true);

	// 🔑 Ref for auto-scroll
	const bottomRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (selectedRoom?.id) {
			const fetchMessages = async () => {
				try {
					const res = await fetch(
						`/api/db/conversations/${selectedRoom.id}/messages`
					);
					if (res.ok) {
						const data = await res.json();
						setMessages(data);
					}
				} catch (e) {
					console.error(e);
				} finally {
					setLoadingMessages(false);
				}
			};
			fetchMessages();
		}
	}, [selectedRoom?.id]);

	// 🔑 Scroll when messages update
	useEffect(() => {
		if (bottomRef.current) {
			bottomRef.current.scrollIntoView({ behavior: "smooth" });
		}
	}, [messages]);

	const handleSendMessage = () => {
		if (!message.trim()) return;

		// TODO: send message to API here

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
			{/* Channel header */}
			<div className="p-4 border-b border-border bg-card/50 backdrop-blur-sm">
				<div className="flex items-center space-x-2">
					<div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center">
						<Hash className="w-4 h-4 text-white" />
					</div>
					<h2 className="capitalize text-lg font-medium">
						{selectedRoom?.name || "Channel"}
					</h2>
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
					{loadingMessages ? (
						<div className="text-sm text-muted-foreground text-center py-8">
							Loading messages...
						</div>
					) : messages.length === 0 ? (
						<div className="text-sm text-muted-foreground text-center py-8">
							No messages yet — start the conversation
						</div>
					) : (
						messages.map((msg) => (
							<div key={msg.id} className="flex space-x-3">
								<Avatar className="w-8 h-8">
									<AvatarImage src={msg.sender.imageUrl || undefined} />
									<AvatarFallback>
										<FontAwesomeIcon icon={faUser} />
									</AvatarFallback>
								</Avatar>
								<div className="flex-1 min-w-0">
									<div className="flex items-baseline space-x-2 mb-1">
										<span className="text-sm font-medium">
											{msg.sender.name || "Sender"}
										</span>
										<span className="text-xs text-muted-foreground">
											@{msg.sender.githubUsername || "username"}
										</span>
										<span className="text-xs text-muted-foreground">
											{msg.createdAt
												? formatDistanceToNow(new Date(msg.createdAt), {
														addSuffix: true,
												  })
												: ""}
										</span>
									</div>
									<p className="text-sm text-gray-800">{msg.content}</p>
								</div>
							</div>
						))
					)}

					{/* Dummy div to scroll into view */}
					<div ref={bottomRef} />
				</div>
			</ScrollArea>

			{/* Message input */}
			<div className="p-4 border-t border-border bg-card/50 backdrop-blur-sm">
				<div className="flex space-x-2">
					<Input
						value={message}
						onChange={(e) => setMessage(e.target.value)}
						onKeyPress={handleKeyPress}
						placeholder={`Message #${selectedRoom?.name || "channel"}`}
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
