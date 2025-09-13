import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { ScrollArea } from "../ui/scroll-area";
import { Send, ArrowLeft, Search, Loader2 } from "lucide-react";
import { ChatArea } from "./chat-area";
import { DMConversation } from "@/types/db-customs";
import { useSession } from "next-auth/react";
import { DmOverview } from "./dm-overview";

interface DirectMessagesProps {
	dms: DMConversation[];
	loadingDms: boolean;
	chatId: string | null;
	setCurrentSection: Dispatch<SetStateAction<string>>;
	onBack: () => void;
}

export default function DirectMessages({
	dms,
	loadingDms,
	chatId,
	setCurrentSection,
	onBack,
}: DirectMessagesProps) {
	const { data: session } = useSession();
	const [dmId, setDmId] = useState(chatId);
	const [searchQuery, setSearchQuery] = useState("");
	const currentConversation = dms.find((conv) => conv.id === dmId);
	const filteredConversations = dms.filter((conv) =>
		(conv.name ?? conv.participants.map((p) => p.githubUsername).join(" "))
			.toLowerCase()
			.includes(searchQuery.toLowerCase())
	);
	const [, setTick] = useState(0);

	useEffect(() => {
		if (!dmId || !session?.user) return;

		const conv = dms.find((c) => c.id === dmId);
		if (!conv || !conv.latestMessage) return;

		const markAsRead = async () => {
			await fetch(`/api/db/conversations/${conv.id}/read`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ lastReadMessageId: conv.latestMessage?.id }),
			});
		};
		markAsRead();
	}, [dmId, session?.user, dms]);

	// Used to trigger re-renders for relative time
	useEffect(() => {
		const interval = setInterval(() => {
			setTick((t) => t + 1);
		}, 60000);

		return () => clearInterval(interval);
	}, []);

	if (loadingDms) {
		return (
			<div className="flex-1 flex items-center justify-center">
				<Loader2 className="animate-spin mr-2" />
				<p>Loading conversations...</p>
			</div>
		);
	}

	if (dms.length === 0) {
		return (
			<div className="flex-1 flex flex-col items-center justify-center bg-muted/20 p-4 mt-8">
				<div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center mb-4">
					<Send className="w-8 h-8 text-white" />
				</div>
				<h3 className="mb-2">No conversations yet</h3>
				<p className="text-center text-muted-foreground mb-4">
					You have no direct message conversations. Start a new conversation to
					connect with other developers!
				</p>
				<Button
					variant="outline"
					className="cursor-pointer"
					onClick={() => setCurrentSection("friends")}
				>
					Find Friends
				</Button>
			</div>
		);
	}

	return (
		<div className="flex-1 flex bg-gradient-to-br from-purple-50 to-orange-50">
			<div
				className={`w-full md:w-100 border-r border-border bg-card ${
					dmId ? "hidden md:block" : "block"
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
							<DmOverview
								key={conversation.id}
								conversation={conversation}
								dmId={dmId}
								setDmId={setDmId}
							/>
						))}
					</div>
				</ScrollArea>
			</div>

			{/* Chat area */}
			{dmId && currentConversation && (
				<ChatArea
					dmId={dmId}
					setDmId={setDmId}
					currentConversation={currentConversation}
				/>
			)}

			{/* No chat selected */}
			{!dmId && (
				<div className="hidden md:flex flex-1 items-center justify-center bg-white h-80">
					<div className="text-center">
						<div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
							<Send className="w-8 h-8 text-white" />
						</div>
						<h3 className="mb-2">Select a conversation</h3>
						<p className="text-muted-foreground">
							Choose a conversation to start messaging
						</p>
					</div>
				</div>
			)}
		</div>
	);
}
