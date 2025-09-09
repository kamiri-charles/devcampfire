import { Session } from "next-auth";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
	Star,
	GitFork,
	ExternalLink,
	Users,
	Calendar,
	Loader2,
} from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import Link from "next/link";
import { Skeleton } from "./ui/skeleton";
import { RepoType } from "@/types/github";
import { formatDistanceToNow } from "date-fns";

interface ProfileSectionProps {
	session: Session | null;
	languages: string[];
	loadingLanguages: boolean;
	repos: RepoType[];
	loadingRepos: boolean;
	user: any;
}

const mockContributions = [
	{ date: "2024-01-15", count: 4 },
	{ date: "2024-01-16", count: 2 },
	{ date: "2024-01-17", count: 7 },
	{ date: "2024-01-18", count: 1 },
	{ date: "2024-01-19", count: 3 },
];

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

export default function ProfileSection({
	session,
	languages,
	loadingLanguages,
	repos,
	loadingRepos,
	user,
}: ProfileSectionProps) {
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

				{/* Tabs for different sections */}
				<Tabs defaultValue="repos" className="space-y-6">
					<TabsList className="grid w-full grid-cols-3">
						<TabsTrigger value="repos">Repositories</TabsTrigger>
						<TabsTrigger value="activity">Activity</TabsTrigger>
						<TabsTrigger value="contributions">Contributions</TabsTrigger>
					</TabsList>

					{loadingRepos ? (
						<TabsContent value="loading-repos" className="space-y-4">
							<Loader2 className="animate-spin" />
						</TabsContent>
					) : (
						<TabsContent value="repos" className="space-y-4">
							{repos.map((repo: RepoType) => (
								<Card key={repo.id}>
									<CardContent className="p-4">
										<div className="flex items-start justify-between">
											<div className="flex-1">
												<div className="flex items-center space-x-2 mb-2">
													<h3 className="text-lg">{repo.name}</h3>
													<Badge variant="outline">{repo.language}</Badge>
												</div>
												<p className="text-muted-foreground text-sm mb-3">
													{repo.description}
												</p>
												<div className="flex items-center space-x-4 text-sm text-muted-foreground">
													<div className="flex items-center space-x-1">
														<Star className="w-4 h-4" />
														<span>{repo.stargazers_count}</span>
													</div>
													<div className="flex items-center space-x-1">
														<GitFork className="w-4 h-4" />
														<span>{repo.forks}</span>
													</div>
													<div className="flex items-center space-x-1">
														<Calendar className="w-4 h-4" />
														<span>
															{repo.updated_at
																? `Updated ${formatDistanceToNow(
																		new Date(repo.updated_at),
																		{
																			addSuffix: true,
																		}
																  )}`
																: "No update info"}
														</span>
													</div>
												</div>
											</div>
											<Button variant="outline" size="sm">
												<ExternalLink className="w-4 h-4 mr-2" />
												View
											</Button>
										</div>
									</CardContent>
								</Card>
							))}
						</TabsContent>
					)}

					<TabsContent value="activity" className="space-y-4">
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
					</TabsContent>

					<TabsContent value="contributions">
						<Card>
							<CardHeader>
								<CardTitle>Contribution Activity</CardTitle>
								<CardDescription>
									Your coding activity over time
								</CardDescription>
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
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
}
