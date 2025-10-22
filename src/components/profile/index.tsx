import { Session } from "next-auth";
import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { ExternalLink, Users } from "lucide-react";

interface ProfileProps {
	session: Session | null;
	languages: string[];
	loadingLanguages: boolean;
}

const mockActivity = [
	{
		type: "repo",
		action: "Created repository",
		target: "awesome-react-hooks",
		time: "2 days ago",
	},
	{
		type: "pr",
		action: "Merged pull request in",
		target: "facebook/react",
		time: "1 week ago",
	},
	{
		type: "issue",
		action: "Opened issue in",
		target: "vercel/next.js",
		time: "2 weeks ago",
	},
];

export default function Profile({
	session,
	languages,
	loadingLanguages,
}: ProfileProps) {
	return (
		<div className="flex-1 p-6 overflow-y-auto">
			<div className="max-w-4xl mx-auto space-y-6">
				{/* Profile Header */}
				<Card>
					<CardContent className="p-6">
						<div className="flex flex-wrap items-start space-x-6">
							<Avatar className="w-20 h-20">
								<AvatarImage
									src={session?.user.image || "/favicon.ico"}
									alt={session?.user.username || "User Avatar"}
								/>
								<AvatarFallback>
									<FontAwesomeIcon icon={faUser} />
								</AvatarFallback>
							</Avatar>
							<div className="flex-1">
								<div className="flex items-center space-x-4 mb-2">
									<h1>{session?.user.name || "developer"}</h1>
									<Badge variant="secondary">
										<FontAwesomeIcon icon={faGithub} className="w-3 h-3 mr-1" />
										@{session?.user.username || "username"}
									</Badge>
								</div>
								<p className="text-muted-foreground mb-4">
									{session?.user.bio}
								</p>
								<div className="flex items-center space-x-6 text-sm">
									<div className="flex items-center space-x-1">
										<Users className="w-4 h-4" />
										<span>{session?.user.followers} followers</span>
									</div>
									<div className="flex items-center space-x-1">
										<span>{session?.user.following} following</span>
									</div>
									<div className="flex items-center space-x-1">
										<FontAwesomeIcon icon={faGithub} className="w-4 h-4" />
										<span>{session?.user.public_repos} repositories</span>
									</div>
								</div>
							</div>
							<Link
								href={`https://github.com/${session?.user.username}`}
								target="_blank"
								rel="noopener noreferrer"
								className="hidden md:block"
							>
								<Button variant="outline" className="cursor-pointer">
									<ExternalLink className="w-4 h-4 mr-2" />
									View on GitHub
								</Button>
							</Link>
						</div>

						{loadingLanguages ? (
							<div className="flex flex-wrap gap-2 mt-8">
								<Skeleton className="w-20 h-7 rounded"></Skeleton>
								<Skeleton className="w-20 h-7 rounded"></Skeleton>
								<Skeleton className="w-20 h-7 rounded"></Skeleton>
								<Skeleton className="w-20 h-7 rounded"></Skeleton>
								<Skeleton className="w-20 h-7 rounded"></Skeleton>
								<Skeleton className="w-20 h-7 rounded"></Skeleton>
								<Skeleton className="w-20 h-7 rounded"></Skeleton>
							</div>
						) : (
							<div className="flex flex-wrap gap-2 mt-8">
								{languages.map((lang: string) => (
									<Badge key={lang} variant="secondary" className="px-3 py-1">
										{lang}
									</Badge>
								))}
							</div>
						)}
					</CardContent>
				</Card>

				{mockActivity.map((activity, index) => (
					<Card key={index}>
						<CardContent className="p-4">
							<div className="flex items-center space-x-3">
								<div className="w-2 h-2 bg-green-500 rounded-full"></div>
								<div className="flex-1">
									<p className="text-sm">
										{activity.action}{" "}
										<span className="font-medium">{activity.target}</span>
									</p>
									<p className="text-xs text-muted-foreground">
										{activity.time}
									</p>
								</div>
							</div>
						</CardContent>
					</Card>
				))}

				<Card>
					<CardHeader>
						<CardTitle>Contribution Activity</CardTitle>
						<CardDescription>Your coding activity over time</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="flex items-center space-x-2 mb-4">
							<div className="text-sm text-muted-foreground">Less</div>
							<div className="flex space-x-1">
								<div className="w-3 h-3 bg-muted rounded-sm"></div>
								<div className="w-3 h-3 bg-green-200 rounded-sm"></div>
								<div className="w-3 h-3 bg-green-400 rounded-sm"></div>
								<div className="w-3 h-3 bg-green-600 rounded-sm"></div>
								<div className="w-3 h-3 bg-green-800 rounded-sm"></div>
							</div>
							<div className="text-sm text-muted-foreground">More</div>
						</div>
						<p className="text-sm text-muted-foreground">
							Total contributions this year:{" "}
							<span className="font-medium">1,247</span>
						</p>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
