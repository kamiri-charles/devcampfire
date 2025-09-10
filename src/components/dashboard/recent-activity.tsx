import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Users, MessageCircle } from "lucide-react";

interface RecentActivityProps {
    onSectionChange: (section: string) => void;
    onStartPrivateChat: (userId: string) => void;
}

const mockActiveFriends = [
	{
		id: "friend1",
		name: "Sarah Chen",
		avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
		status: "Coding in React",
	},
	{
		id: "friend2",
		name: "Marcus Johnson",
		avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=marcus",
		status: "Available",
	},
	{
		id: "friend3",
		name: "Emily Rodriguez",
		avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=emily",
		status: "In a meeting",
	},
];

const mockRecentProjects = [
	{
		id: "proj1",
		name: "dev-campfire-frontend",
		description: "React-based developer community platform",
		language: "TypeScript",
		updatedAt: "2 hours ago",
	},
	{
		id: "proj2",
		name: "code-share-api",
		description: "RESTful API for code snippet sharing",
		language: "Node.js",
		updatedAt: "1 day ago",
	},
	{
		id: "proj3",
		name: "github-activity-bot",
		description: "Discord bot for GitHub notifications",
		language: "Python",
		updatedAt: "3 days ago",
	},
];

export function RecentActivity({ onSectionChange, onStartPrivateChat }: RecentActivityProps) {
  return (
		<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
			{/* Active Friends */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center space-x-2">
						<Users className="w-5 h-5 text-emerald-500" />
						<span>Active Friends</span>
					</CardTitle>
					<CardDescription>Friends currently online</CardDescription>
				</CardHeader>
				<CardContent className="space-y-3">
					{mockActiveFriends.map((friend) => (
						<div
							key={friend.id}
							className="flex items-center space-x-3 p-2 rounded-lg hover:bg-emerald-50 cursor-pointer transition-colors"
						>
							<div className="relative">
								<Avatar className="w-8 h-8">
									<AvatarImage src={friend.avatar} />
									<AvatarFallback>{friend.name[0]}</AvatarFallback>
								</Avatar>
								<div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />
							</div>
							<div className="flex-1 min-w-0">
								<p className="text-sm font-medium text-gray-900 truncate">
									{friend.name}
								</p>
								<p className="text-xs text-gray-500">{friend.status}</p>
							</div>
							<Button
								variant="ghost"
								size="sm"
								className="h-8 w-8 p-0"
								onClick={() => onStartPrivateChat(friend.id)}
							>
								<MessageCircle className="w-4 h-4" />
							</Button>
						</div>
					))}
					<Button
						variant="outline"
						size="sm"
						className="w-full mt-2"
						onClick={() => onSectionChange("friends")}
					>
						View All Friends
					</Button>
				</CardContent>
			</Card>

			{/* Recent Projects */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center space-x-2">
						<FontAwesomeIcon
							icon={faGithub}
							className="w-5 h-5 text-cyan-500"
						/>
						<span>Recent Projects</span>
					</CardTitle>
					<CardDescription>Your latest GitHub activity</CardDescription>
				</CardHeader>
				<CardContent className="space-y-3">
					{mockRecentProjects.map((project) => (
						<div
							key={project.id}
							className="flex items-start space-x-3 p-2 rounded-lg hover:bg-cyan-50 cursor-pointer transition-colors"
						>
							<div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-lg flex items-center justify-center flex-shrink-0">
								<FontAwesomeIcon
									icon={faGithub}
									className="w-4 h-4 text-white"
								/>
							</div>
							<div className="flex-1 min-w-0">
								<p className="text-sm font-medium text-gray-900 truncate">
									{project.name}
								</p>
								<p className="text-xs text-gray-600 line-clamp-2">
									{project.description}
								</p>
								<div className="flex items-center space-x-2 mt-1">
									<Badge className="text-xs bg-cyan-100 text-cyan-700 border-0">
										{project.language}
									</Badge>
									<span className="text-xs text-gray-500">
										{project.updatedAt}
									</span>
								</div>
							</div>
						</div>
					))}
				</CardContent>
			</Card>
		</div>
	);
}

