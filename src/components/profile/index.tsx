import { Session } from "next-auth";
import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
	Card,
	CardContent,
	CardHeader,
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

					<Card>
						<CardHeader>
							<h2 className="text-lg font-semibold">Recent Activity</h2>
						</CardHeader>
						<CardContent className="p-4">
							<div className="flex items-center space-x-3">
								{/* TODO: Implement activity fetching */}
								<p className="text-muted-foreground">No recent activity to display.</p>
							</div>
						</CardContent>
					</Card>
			</div>
		</div>
	);
}
