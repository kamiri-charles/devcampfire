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
	conversationId: string | null;
	setCurrentSection: Dispatch<SetStateAction<string>>;
	onBack: () => void;
}

export default function DirectMessages({
	conversationId,
	setCurrentSection,
	onBack,
}: DirectMessagesProps) {
	const { data: session } = useSession();
	const [dmId, setDmId] = useState<string | null>(conversationId);
	const [dms, setDms] = useState<DMConversation[]>([]);
	const [loadingDms, setLoadingDms] = useState(true);
	const [searchQuery, setSearchQuery] = useState("");
	const currentConversation = dms.find((conv) => conv.id === conversationId);
	const filteredConversations = dms.filter((conv) =>
		(conv.name ?? conv.participants.map((p) => p.githubUsername).join(" "))
			.toLowerCase()
			.includes(searchQuery.toLowerCase())
	);
	const [, setTick] = useState(0);

	useEffect(() => {
		const fetchDms = async () => {
			try {
				const res = await fetch("api/db/conversations/dms?limit=50");
				if (res.ok) {
					const data = await res.json();
					setDms(data);
				}
			} catch (e) {
				console.error(e);
			} finally {
				setLoadingDms(false);
			}
		};
		fetchDms();
	}, []);

	// After opening a conversation, reset the unreadCount for that dm
	useEffect(() => {
		if (!conversationId) return;
		setDms((prevDms) =>
			prevDms.map((dm) =>
				dm.id === conversationId ? { ...dm, unreadCount: 0 } : dm
			)
		);
	}, [conversationId]);

	// Used to trigger re-renders for relative time
	useEffect(() => {
		const interval = setInterval(() => {
			setTick((t) => t + 1);
		}, 60000);

		return () => clearInterval(interval);
	}, []);

	if (loadingDms) {
		return (
			<div className="flex-1 flex flex-col items-center justify-center h-100">
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
					conversationId ? "hidden md:block" : "block"
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
								dmId={conversationId}
								setDmId={setDmId}
							/>
						))}
					</div>
				</ScrollArea>
			</div>

			{/* Chat area */}
			{conversationId && currentConversation && (
				<ChatArea
					conversationId={conversationId}
					setConversationId={setDmId}
					currentConversation={currentConversation}
				/>
			)}

			{/* No chat selected */}
			{!conversationId && (
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
