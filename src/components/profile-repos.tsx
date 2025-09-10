import { RepoType } from "@/types/github";
import { TabsContent } from "./ui/tabs";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "./ui/card";
import {
	BookOpen,
	Clock,
	ExternalLink,
	Filter,
	GitFork,
	Loader2,
	Search,
	Star,
	Unlock,
} from "lucide-react";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "./ui/select";
import { Button } from "./ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { useMemo, useState } from "react";
import { formatDistanceToNow } from "date-fns";

interface ProfileReposProps {
	repos: RepoType[];
	loadingRepos: boolean;
}

function ProfileRepos({ repos, loadingRepos }: ProfileReposProps) {
	const [searchQuery, setSearchQuery] = useState("");
	const [languageFilter, setLanguageFilter] = useState("all");
	const [typeFilter, setTypeFilter] = useState("all");
	const [sortBy, setSortBy] = useState("updated");

	// Unique languages
	const availableLanguages = useMemo(() => {
		const languages = new Set(
			repos.map((repo) => repo.language).filter(Boolean)
		);
		return Array.from(languages).sort();
	}, [repos]);

	// Filter + sort
	const filteredRepos = useMemo(() => {
		let filtered = repos.filter((repo) => {
			const matchesSearch =
				repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				repo.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
				repo.topics?.some((topic) =>
					topic.toLowerCase().includes(searchQuery.toLowerCase())
				);

			const matchesLanguage =
				languageFilter === "all" || repo.language === languageFilter;

			const matchesType =
				typeFilter === "all" ||
				(typeFilter === "public" && !repo.private) ||
				(typeFilter === "private" && repo.private);

			return matchesSearch && matchesLanguage && matchesType;
		});

		filtered.sort((a, b) => {
			switch (sortBy) {
				case "name":
					return a.name.localeCompare(b.name);
				case "stars":
					return b.stargazers_count - a.stargazers_count;
				case "updated":
				default:
					const dateB = b.updated_at ? new Date(b.updated_at).getTime() : 0;
					const dateA = a.updated_at ? new Date(a.updated_at).getTime() : 0;
					return dateB - dateA;
			}
		});

		return filtered;
	}, [repos, searchQuery, languageFilter, typeFilter, sortBy]);

	return (
		<TabsContent value="repos" className="space-y-0">
			{/* Loading */}
			{loadingRepos && (
				<div className="flex justify-center items-center py-16">
					<Loader2 className="animate-spin" />
					<p className="text-gray-600">Getting you repos...</p>
				</div>
			)}

			{!loadingRepos && repos.length === 0 && (
				<Card className="border-purple-200/50">
					<CardContent className="p-8 text-center">
						<FontAwesomeIcon
							icon={faGithub}
							className="w-12 h-12 text-gray-400 mx-auto mb-4"
						/>
						<h3 className="text-lg font-medium text-gray-900 mb-2">
							No repositories available
						</h3>
						<p className="text-gray-500">This user has no repositories yet.</p>
					</CardContent>
				</Card>
			)}

			{!loadingRepos && repos.length > 0 && (
				<>
					{/* Sticky Controls */}
					<div className="sticky top-0 z-40 bg-gradient-to-br from-purple-50 to-orange-50 pb-4">
						<Card className="border-purple-200/50 shadow-lg">
							<CardHeader className="pb-4">
								<div className="flex items-center justify-between">
									<div>
										<CardTitle className="flex items-center space-x-2">
											<BookOpen className="w-5 h-5 text-purple-500" />
											<span>Repositories</span>
											<Badge className="bg-purple-100 text-purple-700 border-0">
												{filteredRepos.length}
											</Badge>
										</CardTitle>
										<CardDescription>
											Search and filter through repositories
										</CardDescription>
									</div>
								</div>
							</CardHeader>
							<CardContent className="space-y-4">
								{/* Search */}
								<div className="relative">
									<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
									<Input
										placeholder="Search repositories, descriptions, or topics..."
										value={searchQuery}
										onChange={(e) => setSearchQuery(e.target.value)}
										className="pl-10 bg-white border-purple-200 focus:border-purple-400"
									/>
								</div>

								{/* Filters */}
								<div className="flex flex-wrap gap-4">
									<div className="flex items-center space-x-2">
										<Filter className="w-4 h-4 text-gray-500" />
										<span className="text-sm font-medium text-gray-700">
											Filters:
										</span>
									</div>

									<Select
										value={languageFilter}
										onValueChange={setLanguageFilter}
									>
										<SelectTrigger className="w-40 bg-white border-purple-200">
											<SelectValue placeholder="Language" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="all">All Languages</SelectItem>
											{availableLanguages.map((lang) => (
												<SelectItem key={lang} value={lang || "lang"}>
													{lang}
												</SelectItem>
											))}
										</SelectContent>
									</Select>

									<Select value={typeFilter} onValueChange={setTypeFilter}>
										<SelectTrigger className="w-32 bg-white border-purple-200">
											<SelectValue placeholder="Type" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="all">All Types</SelectItem>
											<SelectItem value="public">Public</SelectItem>
											<SelectItem value="private">Private</SelectItem>
										</SelectContent>
									</Select>

									<Select value={sortBy} onValueChange={setSortBy}>
										<SelectTrigger className="w-40 bg-white border-purple-200">
											<SelectValue placeholder="Sort by" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="updated">Recently Updated</SelectItem>
											<SelectItem value="name">Name</SelectItem>
											<SelectItem value="stars">Most Stars</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Repo List */}
					<div className="space-y-4 pt-4">
						{filteredRepos.length === 0 ? (
							<Card className="border-purple-200/50">
								<CardContent className="p-8 text-center">
									<FontAwesomeIcon
										icon={faGithub}
										className="w-12 h-12 text-gray-400 mx-auto mb-4"
									/>
									<h3 className="text-lg font-medium text-gray-900 mb-2">
										No repositories found
									</h3>
									<p className="text-gray-500">
										Try adjusting your search or filter criteria
									</p>
								</CardContent>
							</Card>
						) : (
							filteredRepos.map((repo) => (
								<Card
									key={repo.id}
									className="hover:shadow-lg transition-shadow border-purple-200/50"
								>
									<CardContent className="p-6">
										<div className="flex items-start justify-between">
											<div className="flex-1 min-w-0">
												<div className="flex items-center space-x-3 mb-3">
													<div className="flex items-center space-x-2">
														<Unlock className="w-4 h-4 text-emerald-500" />
														<h3 className="text-lg font-semibold text-gray-900 truncate">
															{repo.name}
														</h3>
													</div>
													{repo.language && (
														<Badge className="bg-blue-100 text-blue-700 border-0">
															{repo.language}
														</Badge>
													)}
												</div>

												<p className="text-gray-600 text-sm mb-4 leading-relaxed">
													{repo.description}
												</p>

												{repo.topics && repo.topics.length > 0 && (
													<div className="flex flex-wrap gap-1 mb-4">
														{repo.topics.map((topic) => (
															<Badge
																key={topic}
																variant="outline"
																className="text-xs text-purple-600 border-purple-200 bg-purple-50"
															>
																{topic}
															</Badge>
														))}
													</div>
												)}

												<div className="flex items-center space-x-6 text-sm text-gray-500">
													<div className="flex items-center space-x-1">
														<Star className="w-4 h-4" />
														<span>{repo.stargazers_count}</span>
													</div>
													<div className="flex items-center space-x-1">
														<GitFork className="w-4 h-4" />
														<span>{repo.forks}</span>
													</div>
													<div className="flex items-center space-x-1">
														<Clock className="w-4 h-4" />
														<span>
															{repo.updated_at
																? `Updated ${formatDistanceToNow(
																		new Date(repo.updated_at),
																		{ addSuffix: true }
																  )}`
																: "No update info"}
														</span>
													</div>
													<div className="text-xs">{repo.size}</div>
												</div>
											</div>

											<div className="flex space-x-2 ml-4">
												<Button
													variant="outline"
													size="sm"
													className="border-purple-200 hover:bg-purple-50"
													asChild
												>
													<a
														href={repo.html_url}
														target="_blank"
														rel="noopener noreferrer"
													>
														<FontAwesomeIcon
															icon={faGithub}
															className="w-4 h-4 mr-2"
														/>
														Code
													</a>
												</Button>
												{repo.homepage && (
													<Button
														variant="outline"
														size="sm"
														className="border-purple-200 hover:bg-purple-50"
														asChild
													>
														<a
															href={repo.homepage}
															target="_blank"
															rel="noopener noreferrer"
														>
															<ExternalLink className="w-4 h-4 mr-2" />
															View
														</a>
													</Button>
												)}
											</div>
										</div>
									</CardContent>
								</Card>
							))
						)}
					</div>
				</>
			)}
		</TabsContent>
	);
}

export default ProfileRepos;
