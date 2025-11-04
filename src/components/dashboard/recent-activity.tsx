import {useState, Dispatch, SetStateAction, useEffect} from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Users, Loader2 } from "lucide-react";
import { GitHubConnections, GitHubUserLite } from "@/types/github";
import { faUser } from "@fortawesome/free-solid-svg-icons";

interface RecentActivityProps {
	connections: GitHubConnections | null;
    setCurrentSection: Dispatch<SetStateAction<string>>;
    handleOpenDM: (conversationId: string) => void;
}	

export function RecentActivity({ connections, setCurrentSection }: RecentActivityProps) {
	const [activeFriends, setActiveFriends] = useState<GitHubUserLite[]>([]);
	const [loadingActiveFriends, setLoadingActiveFriends] = useState(false);

	useEffect(() => {
		if (!connections) return;

		const uniqueUsersMap: Record<string, GitHubUserLite> = {};
		connections.followers.forEach((user) => {
			uniqueUsersMap[user.id] = user;
		});
		connections.following.forEach((user) => {
			uniqueUsersMap[user.id] = user;
		});
		const uniqueUsers = Object.values(uniqueUsersMap);

		// Extract usernames to send to API
		const usernames = uniqueUsers.map((u) => u.username);

		const fetchActiveFriends = async () => {
			setLoadingActiveFriends(true);
			try {
				const res = await fetch("/api/db/users/online", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ usernames }),
				});

				if (!res.ok) {
					throw new Error(`Failed with status ${res.status}`);
				}

				const data = await res.json();

				setActiveFriends(data.users);
			} catch (err) {
				console.error("Error fetching active friends:", err);
				setActiveFriends([]);
			} finally {
				setLoadingActiveFriends(false);
			}
		};

		fetchActiveFriends();
	}, [connections]);


		
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
					{loadingActiveFriends ? (
						<div className="flex justify-center items-center h-20">
							<Loader2 className="animate-spin text-emerald-500" />
						</div>
					) : activeFriends.length === 0 ? (
						<div className="text-center text-gray-500">
							No active friends online right now
						</div>
					) : (
						<>
							{activeFriends.map((friend) => (
								<div
									key={friend.id}
									className="flex items-center space-x-3 p-2 rounded-lg hover:bg-emerald-50 cursor-pointer transition-colors"
								>
									<div className="relative">
										<Avatar className="w-8 h-8">
											<AvatarImage src={friend.avatar} />
											<AvatarFallback><FontAwesomeIcon icon={faUser} /></AvatarFallback>
										</Avatar>
										<div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />
									</div>
									<div className="flex-1 min-w-0">
										<p className="text-sm font-medium text-gray-900 truncate">
											{friend.username}
										</p>
										<p className="text-xs text-gray-500">online</p>
									</div>
								</div>
							))}
							<Button
								variant="outline"
								size="sm"
								className="w-full mt-2"
								onClick={() => setCurrentSection("friends")}
							>
								View All Friends
							</Button>
						</>
					)}
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
				</CardHeader>
				<CardContent className="space-y-3">
					{/* TODO: Implement recent projects fetching */}
					<p className="text-muted-foreground">No recent projects to display.</p>
				</CardContent>
			</Card>
		</div>
	);
}

