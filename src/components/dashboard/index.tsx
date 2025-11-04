import { Dispatch, SetStateAction } from "react";
import { Session } from "next-auth";
import { RecentChats } from "./recent-chats";
import { Notifications } from "./notifications";
import { QuickActions } from "./quick-actions";
import { RecentActivity } from "./recent-activity";
import { Card, CardContent } from "../ui/card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { Users, TrendingUp } from "lucide-react";
import { DBConversation } from "@/db/schema";
import { GitHubConnections } from "@/types/github";

interface DashboardProps {
	session: Session | null;
	connections: GitHubConnections | null;
	setCurrentSection: Dispatch<SetStateAction<string>>;
	handleOpenDM: (conversationId: string) => void;
	setSelectedRoom: Dispatch<SetStateAction<DBConversation | null>>;
}

export default function Dashboard({
	session,
	connections,
	setCurrentSection,
	handleOpenDM,
	setSelectedRoom,
}: DashboardProps) {

	const connectionCount = connections ? connections.followers.length + connections.following.length : 0;

	if (!session) return null;

	return (
		<div className="flex-1 p-4 md:p-6 overflow-y-auto bg-gradient-to-br from-purple-50 to-orange-50">
			<div className="max-w-7xl mx-auto space-y-6">
				<div className="mb-8">
					<h1 className="text-2xl md:text-3xl bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent">
						Welcome back,{" "}
						{session?.user.name?.split(" ")[0] ||
							session?.user.username ||
							"User"}
						!
					</h1>
					<p className="text-muted-foreground mt-2">
						{"Here's what's happening in your developer community"}
					</p>
				</div>

				{/* Stats */}
				<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
					<Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
						<CardContent className="p-4">
							<div className="flex items-center space-x-2">
								<Users className="w-5 h-5" />
								<div>
									<p className="text-sm opacity-90">Connections</p>
									<p className="text-xl font-semibold">{connectionCount}</p>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card className="bg-gradient-to-br from-cyan-500 to-cyan-600 text-white border-0">
						<CardContent className="p-4">
							<div className="flex items-center space-x-2">
								<FontAwesomeIcon icon={faGithub} className="w-5 h-5" />
								<div>
									<p className="text-sm opacity-90">Repos</p>
									<p className="text-xl font-semibold">
										{session.user.public_repos || 0}
									</p>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-0">
						<CardContent className="p-4">
							<div className="flex items-center space-x-2">
								<TrendingUp className="w-5 h-5" />
								<div>
									<p className="text-sm opacity-90">Reputation</p>
									<p className="text-xl font-semibold">0</p>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					{/* Left column */}
					<div className="lg:col-span-2 space-y-6">
						<RecentChats
							setCurrentSection={setCurrentSection}
							handleOpenDM={handleOpenDM}
							setSelectedRoom={setSelectedRoom}
						/>
						<RecentActivity
							setCurrentSection={setCurrentSection}
							handleOpenDM={handleOpenDM}
							connections={connections}
						/>
					</div>

					{/* Right column */}
					<div className="space-y-6 lg:h-fit">
						<Notifications />
						<QuickActions setCurrentSection={setCurrentSection} />
					</div>
				</div>
			</div>
		</div>
	);
}
