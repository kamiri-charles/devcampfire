import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Button } from "../ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Input } from "../ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Loader2, Mail, MessageCircle, Search } from "lucide-react";
import {
	GitHubConnections,
	GitHubUserEnriched,
	GitHubUserLite,
} from "@/types/github";
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationPrevious,
	PaginationLink,
	PaginationNext,
} from "../ui/pagination";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { getPaginationRange } from "@/lib/utils";
import Link from "next/link";

interface FriendsProps {
	connections: GitHubConnections | null;
	loadingConnections: boolean;
}

export default function Friends({
	connections,
	loadingConnections,
}: FriendsProps) {
	const [activeTab, setActiveTab] = useState<
		"mutual" | "following" | "followers" | "in-app"
	>("following");
	const [searchQuery, setSearchQuery] = useState("");
	const [page, setPage] = useState(1);
	const perPage = 6;
	const [enrichedUsers, setEnrichedUsers] = useState<
		Record<string, GitHubUserEnriched>
	>({});
	const [userStatus, setUserStatus] = useState<
		Record<string, "loading" | "exists" | "not-found">
	>({});


	// Decide which list to use
	const currentList: GitHubUserLite[] = useMemo(() => {
		if (!connections) return [];

		switch (activeTab) {
			case "mutual":
				return connections.mutuals;
			case "following":
				return connections.following;
			case "followers":
				return connections.followers;
			case "in-app":
				return []; // TODO: add filter later
			default:
				return connections.followers;
		}
	}, [activeTab, connections]);

	// Apply search filter (global across all connections)
	const filteredList = useMemo(() => {
		if (!connections) return [];

		if (!searchQuery) return currentList;

		// Combine all unique users across tabs
		const allUsers = Array.from(
			new Map(
				[
					...connections.followers,
					...connections.following,
					...connections.mutuals,
					// TODO: later add in-app when ready
				].map((u) => [u.id, u])
			).values()
		);

		return allUsers.filter((user) =>
			user.username.toLowerCase().includes(searchQuery.toLowerCase())
		);
	}, [searchQuery, currentList, connections]);

	const totalPages = Math.ceil(filteredList.length / perPage);

	const paginatedList = useMemo(() => {
		const start = (page - 1) * perPage;
		return filteredList.slice(start, start + perPage);
	}, [page, filteredList]);

	const getStatusColor = (status: string) => {
		switch (status) {
			case "online":
				return "bg-emerald-500";
			case "away":
				return "bg-yellow-500";
			case "offline":
				return "bg-gray-400";
			default:
				return "bg-gray-400";
		}
	};

	async function openDM(targetUsername: string) {
		try {
			const res = await fetch("/api/conversations", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ targetUsername }),
			});

			const data = await res.json();
			if (data.conversationId) {
				console.log("Open DM with ID:", data.conversationId);
			}
		} catch (err) {
			console.error("Failed to open DM:", err);
		}
	}

	useEffect(() => {
		const fetchEnrichment = async () => {
			const missing = paginatedList.filter((u) => !enrichedUsers[u.username]);

			if (missing.length === 0) return;

			const results = await Promise.all(
				missing.map(async (u) => {
					try {
						const res = await fetch(`/api/github/connections/${u.username}`);
						if (!res.ok) return null;
						const data = await res.json();
						return data as GitHubUserEnriched;
					} catch {
						return null;
					}
				})
			);

			const validResults = results.filter(Boolean) as GitHubUserEnriched[];

			setEnrichedUsers((prev) => {
				const next = { ...prev };
				validResults.forEach((u) => {
					next[u.username] = u;
				});
				return next;
			});
		};

		fetchEnrichment();
	}, [paginatedList, enrichedUsers]);

	useEffect(() => {
		paginatedList.forEach((user) => {
			if (!userStatus[user.username]) {
				setUserStatus((prev) => ({ ...prev, [user.username]: "loading" }));

				fetch(`/api/users/check-existence/${user.username}`)
					.then((res) => res.json())
					.then((data) => {
						setUserStatus((prev) => ({
							...prev,
							[user.username]: data.exists ? "exists" : "not-found",
						}));
					})
					.catch(() => {
						setUserStatus((prev) => ({
							...prev,
							[user.username]: "not-found",
						}));
					});
			}
		});
	}, [paginatedList, userStatus]);


	useEffect(() => {
		setPage(1);
	}, [activeTab, searchQuery]);

	if (loadingConnections) {
		return (
			<div className="flex flex-col items-center justify-center mt-4">
				<Loader2 className="animate-spin" />
				<p className="mt-2 text-gray-500">Loading connections...</p>
			</div>
		);
	}

	if (!connections) {
		return (
			<div className="text-gray-500 text-center mt-8">
				No connections available
			</div>
		);
	}

	return (
		<div className="p-6 max-w-7xl mx-auto">
			<div className="mb-6">
				<h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent">
					Friends
				</h1>
				<p className="text-gray-600 mt-2">
					Connect with developers in your network
				</p>
			</div>

			{/* Search */}
			<div className="mb-6">
				<div className="relative max-w-md">
					<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
					<Input
						placeholder="Search friends..."
						value={searchQuery}
						onChange={(e) => {
							setSearchQuery(e.target.value);
							setPage(1);
						}}
						className="pl-10 bg-white border-purple-200 focus:border-purple-400"
					/>
				</div>
			</div>

			<Tabs defaultValue="following" className="space-y-6">
				{!searchQuery && (
					<TabsList className="bg-white border border-purple-200">
						<TabsTrigger
							value="following"
							onClick={() => setActiveTab("following")}
							className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700 cursor-pointer hover:bg-purple-50"
						>
							Following ({connections.following.length})
						</TabsTrigger>
						<TabsTrigger
							value="followers"
							onClick={() => setActiveTab("followers")}
							className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700 cursor-pointer hover:bg-purple-50"
						>
							Followers ({connections.followers.length})
						</TabsTrigger>
						<TabsTrigger
							value="mutual"
							onClick={() => setActiveTab("mutual")}
							className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700 cursor-pointer hover:bg-purple-50"
						>
							Mutual ({connections.mutuals.length})
						</TabsTrigger>
						<TabsTrigger
							value="in-app"
							onClick={() => setActiveTab("in-app")}
							className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700 cursor-pointer hover:bg-purple-50"
						>
							In-App (0)
						</TabsTrigger>
					</TabsList>
				)}

				{/* Pagination */}
				{totalPages > 1 && (
					<Pagination className="mt-6">
						<PaginationContent>
							<PaginationItem>
								<PaginationPrevious
									onClick={() => setPage((p) => Math.max(1, p - 1))}
									className={
										page === 1
											? "pointer-events-none opacity-50"
											: "cursor-pointer"
									}
								/>
							</PaginationItem>

							{getPaginationRange(page, totalPages).map((item, i) => (
								<PaginationItem key={i} className="cursor-pointer">
									{item === "..." ? (
										<span className="px-3">…</span>
									) : (
										<PaginationLink
											isActive={page === item}
											onClick={() => setPage(item as number)}
										>
											{item}
										</PaginationLink>
									)}
								</PaginationItem>
							))}

							<PaginationItem>
								<PaginationNext
									onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
									className={
										page === totalPages
											? "pointer-events-none opacity-50"
											: "cursor-pointer"
									}
								/>
							</PaginationItem>
						</PaginationContent>
					</Pagination>
				)}

				{/* TabsContent or Search Results */}
				{!searchQuery ? (
					<TabsContent value={activeTab} className="space-y-4">
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
							{paginatedList.map((conn) => {
								const enriched = enrichedUsers[conn.username];
								return (
									<Card
										key={conn.id}
										className="hover:shadow-lg transition-shadow border-purple-200/50"
									>
										<CardHeader className="pb-4">
											<div className="flex items-start justify-between">
												<div className="flex items-center space-x-3">
													<div className="relative">
														<Avatar className="h-12 w-12">
															<AvatarImage
																src={conn.avatar}
																alt={enriched?.name || conn.username}
															/>
															<AvatarFallback>
																<FontAwesomeIcon icon={faUser} />
															</AvatarFallback>
														</Avatar>
														<div
															className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${getStatusColor(
																"Online"
															)}`}
														/>
													</div>
													<div className="flex-1 min-w-0">
														<h3 className="font-semibold text-gray-900 truncate">
															{enriched?.name || "developer"}
														</h3>
														<p className="text-sm text-gray-500">
															@{conn.username}
														</p>
													</div>
												</div>
											</div>
										</CardHeader>
										<CardContent className="space-y-4">
											<p className="text-sm text-gray-600 line-clamp-2">
												{enriched?.bio || "No bio available"}
											</p>

											<div className="flex space-x-2">
												{userStatus[conn.username] === "loading" ? (
													<Button size="sm" disabled>
														<Loader2 className="w-4 h-4 mr-2 animate-spin" />
														Loading...
													</Button>
												) : userStatus[conn.username] === "exists" ? (
													<Button
														size="sm"
														onClick={() => openDM(conn.username)}
														className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 cursor-pointer"
													>
														<MessageCircle className="w-4 h-4 mr-2" /> Message
													</Button>
												) : (
													<Button
														size="sm"
														variant="outline"
														onClick={() => console.log("Invite", conn.username)}
														className="border-purple-200 hover:bg-purple-50 cursor-pointer"
													>
														<Mail className="w-4 h-4 mr-2" /> Invite
													</Button>
												)}

												<Link
													href={`https://github.com/${conn.username}`}
													target="_blank"
													rel="noopener noreferrer"
												>
													<Button
														variant="outline"
														size="sm"
														className="border-purple-200 hover:bg-purple-50 cursor-pointer"
													>
														<FontAwesomeIcon
															icon={faGithub}
															className="w-4 h-4"
														/>
													</Button>
												</Link>
											</div>
										</CardContent>
									</Card>
								);
							})}
						</div>
					</TabsContent>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						{paginatedList.map((conn) => {
							const enriched = enrichedUsers[conn.username];
							return (
								<Card
									key={conn.id}
									className="hover:shadow-lg transition-shadow border-purple-200/50"
								>
									<CardHeader className="pb-4">
										<div className="flex items-start justify-between">
											<div className="flex items-center space-x-3">
												<div className="relative">
													<Avatar className="h-12 w-12">
														<AvatarImage
															src={conn.avatar}
															alt={enriched?.name || conn.username}
														/>
														<AvatarFallback>
															<FontAwesomeIcon icon={faUser} />
														</AvatarFallback>
													</Avatar>
													<div
														className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${getStatusColor(
															"Online"
														)}`}
													/>
												</div>
												<div className="flex-1 min-w-0">
													<h3 className="font-semibold text-gray-900 truncate">
														{enriched?.name || "developer"}
													</h3>
													<p className="text-sm text-gray-500">
														@{conn.username}
													</p>
												</div>
											</div>
										</div>
									</CardHeader>
									<CardContent className="space-y-4">
										<p className="text-sm text-gray-600 line-clamp-2">
											{enriched?.bio || "No bio available"}
										</p>

										<div className="flex space-x-2">
											{userStatus[conn.username] === "loading" ? (
												<Button size="sm" disabled>
													<Loader2 className="animate-spin w-4 h-4 mr-2" />{" "}
													Loading...
												</Button>
											) : userStatus[conn.username] === "exists" ? (
												<Button
													size="sm"
													onClick={() => openDM(conn.username)}
													className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 cursor-pointer"
												>
													<MessageCircle className="w-4 h-4 mr-2" /> Message
												</Button>
											) : (
												<Button
													size="sm"
													variant="outline"
													onClick={() => console.log("Invite", conn.username)}
													className="border-purple-200 hover:bg-purple-50 cursor-pointer"
												>
													<Mail className="w-4 h-4 mr-2" /> Invite
												</Button>
											)}

											<Link
												href={`https://github.com/${conn.username}`}
												target="_blank"
												rel="noopener noreferrer"
											>
												<Button
													variant="outline"
													size="sm"
													className="border-purple-200 hover:bg-purple-50 cursor-pointer"
												>
													<FontAwesomeIcon
														icon={faGithub}
														className="w-4 h-4"
													/>
												</Button>
											</Link>
										</div>
									</CardContent>
								</Card>
							);
						})}
					</div>
				)}
			</Tabs>
		</div>
	);
}