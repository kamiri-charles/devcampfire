import { useState } from "react";
import {
	Card,
	CardContent,
	CardHeader,
} from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Input } from "../ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
	MessageCircle,
	UserPlus,
	UserMinus,
	Github,
	Search,
	Users,
	Code2,
	ExternalLink,
} from "lucide-react";

interface Friend {
	id: string;
	name: string;
	username: string;
	avatar: string;
	status: "online" | "offline" | "away";
	languages: string[];
	bio: string;
	followers: number;
	following: number;
	publicRepos: number;
	lastActive: string;
	isFollowing: boolean;
	mutualFriends: number;
}

interface FriendsProps {
	onStartPrivateChat?: (userId: string) => void;
}

const mockFriends: Friend[] = [
	{
		id: "1",
		name: "Sarah Chen",
		username: "sarahdev",
		avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
		status: "online",
		languages: ["TypeScript", "React", "Node.js"],
		bio: "Full-stack developer passionate about web accessibility and performance",
		followers: 245,
		following: 123,
		publicRepos: 42,
		lastActive: "now",
		isFollowing: true,
		mutualFriends: 8,
	},
	{
		id: "2",
		name: "Marcus Johnson",
		username: "marcusj",
		avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=marcus",
		status: "away",
		languages: ["Python", "Django", "PostgreSQL"],
		bio: "Backend engineer building scalable systems at scale",
		followers: 156,
		following: 89,
		publicRepos: 28,
		lastActive: "2 hours ago",
		isFollowing: true,
		mutualFriends: 5,
	},
	{
		id: "3",
		name: "Emily Rodriguez",
		username: "emily_codes",
		avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=emily",
		status: "offline",
		languages: ["JavaScript", "Vue.js", "Go"],
		bio: "Frontend developer who loves creating beautiful user experiences",
		followers: 189,
		following: 201,
		publicRepos: 35,
		lastActive: "1 day ago",
		isFollowing: true,
		mutualFriends: 12,
	},
	{
		id: "4",
		name: "Alex Kumar",
		username: "alexk_dev",
		avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex",
		status: "online",
		languages: ["Rust", "WebAssembly", "C++"],
		bio: "Systems programmer exploring the boundaries of web performance",
		followers: 312,
		following: 78,
		publicRepos: 23,
		lastActive: "now",
		isFollowing: true,
		mutualFriends: 3,
	},
];

const mockSuggestions: Friend[] = [
	{
		id: "5",
		name: "David Liu",
		username: "davidliu",
		avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=david",
		status: "online",
		languages: ["Java", "Spring", "Kotlin"],
		bio: "Mobile and backend developer building fintech solutions",
		followers: 198,
		following: 156,
		publicRepos: 31,
		lastActive: "now",
		isFollowing: false,
		mutualFriends: 7,
	},
	{
		id: "6",
		name: "Luna Martinez",
		username: "luna_dev",
		avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=luna",
		status: "away",
		languages: ["Swift", "iOS", "UIKit"],
		bio: "iOS developer crafting delightful mobile experiences",
		followers: 267,
		following: 134,
		publicRepos: 19,
		lastActive: "30 min ago",
		isFollowing: false,
		mutualFriends: 4,
	},
];

export default function Friends({
	onStartPrivateChat,
}: FriendsProps) {
	const [searchQuery, setSearchQuery] = useState("");
	const [friends, setFriends] = useState(mockFriends);
	const [suggestions, setSuggestions] = useState(mockSuggestions);

	const handleFollow = (friendId: string) => {
		setSuggestions((prev) =>
			prev.map((friend) =>
				friend.id === friendId
					? { ...friend, isFollowing: !friend.isFollowing }
					: friend
			)
		);
	};

	const handleUnfollow = (friendId: string) => {
		setFriends((prev) =>
			prev.map((friend) =>
				friend.id === friendId ? { ...friend, isFollowing: false } : friend
			)
		);
	};

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

	const filteredFriends = friends.filter(
		(friend) =>
			friend.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			friend.username.toLowerCase().includes(searchQuery.toLowerCase())
	);

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
						onChange={(e) => setSearchQuery(e.target.value)}
						className="pl-10 bg-white border-purple-200 focus:border-purple-400"
					/>
				</div>
			</div>

			<Tabs defaultValue="following" className="space-y-6">
				<TabsList className="bg-white border border-purple-200">
					<TabsTrigger
						value="following"
						className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700"
					>
						Following ({friends.length})
					</TabsTrigger>
					<TabsTrigger
						value="suggestions"
						className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700"
					>
						Suggestions ({suggestions.length})
					</TabsTrigger>
				</TabsList>

				<TabsContent value="following" className="space-y-4">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						{filteredFriends.map((friend) => (
							<Card
								key={friend.id}
								className="hover:shadow-lg transition-shadow border-purple-200/50"
							>
								<CardHeader className="pb-4">
									<div className="flex items-start justify-between">
										<div className="flex items-center space-x-3">
											<div className="relative">
												<Avatar className="h-12 w-12">
													<AvatarImage src={friend.avatar} alt={friend.name} />
													<AvatarFallback>{friend.name[0]}</AvatarFallback>
												</Avatar>
												<div
													className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${getStatusColor(
														friend.status
													)}`}
												/>
											</div>
											<div className="flex-1 min-w-0">
												<h3 className="font-semibold text-gray-900 truncate">
													{friend.name}
												</h3>
												<p className="text-sm text-gray-500">
													@{friend.username}
												</p>
												<p className="text-xs text-gray-400">
													{friend.lastActive}
												</p>
											</div>
										</div>
										<Button
											variant="ghost"
											size="sm"
											onClick={() => handleUnfollow(friend.id)}
											className="text-gray-400 hover:text-red-500"
										>
											<UserMinus className="w-4 h-4" />
										</Button>
									</div>
								</CardHeader>
								<CardContent className="space-y-4">
									<p className="text-sm text-gray-600 line-clamp-2">
										{friend.bio}
									</p>

									<div className="flex flex-wrap gap-1">
										{friend.languages.slice(0, 3).map((lang) => (
											<Badge
												key={lang}
												className="text-xs bg-purple-100 text-purple-700 border-0"
											>
												{lang}
											</Badge>
										))}
										{friend.languages.length > 3 && (
											<Badge variant="outline" className="text-xs">
												+{friend.languages.length - 3}
											</Badge>
										)}
									</div>

									<div className="flex items-center justify-between text-xs text-gray-500">
										<div className="flex items-center space-x-3">
											<span className="flex items-center space-x-1">
												<Users className="w-3 h-3" />
												<span>{friend.followers}</span>
											</span>
											<span className="flex items-center space-x-1">
												<Code2 className="w-3 h-3" />
												<span>{friend.publicRepos}</span>
											</span>
										</div>
										{friend.mutualFriends > 0 && (
											<span className="text-purple-600">
												{friend.mutualFriends} mutual
											</span>
										)}
									</div>

									<div className="flex space-x-2">
										<Button
											size="sm"
											onClick={() => onStartPrivateChat?.(friend.id)}
											className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
										>
											<MessageCircle className="w-4 h-4 mr-2" />
											Message
										</Button>
										<Button
											variant="outline"
											size="sm"
											className="border-purple-200 hover:bg-purple-50"
										>
											<Github className="w-4 h-4" />
										</Button>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				</TabsContent>

				<TabsContent value="suggestions" className="space-y-4">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						{suggestions.map((friend) => (
							<Card
								key={friend.id}
								className="hover:shadow-lg transition-shadow border-purple-200/50"
							>
								<CardHeader className="pb-4">
									<div className="flex items-start justify-between">
										<div className="flex items-center space-x-3">
											<div className="relative">
												<Avatar className="h-12 w-12">
													<AvatarImage src={friend.avatar} alt={friend.name} />
													<AvatarFallback>{friend.name[0]}</AvatarFallback>
												</Avatar>
												<div
													className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${getStatusColor(
														friend.status
													)}`}
												/>
											</div>
											<div className="flex-1 min-w-0">
												<h3 className="font-semibold text-gray-900 truncate">
													{friend.name}
												</h3>
												<p className="text-sm text-gray-500">
													@{friend.username}
												</p>
												<p className="text-xs text-purple-600">
													{friend.mutualFriends} mutual friends
												</p>
											</div>
										</div>
									</div>
								</CardHeader>
								<CardContent className="space-y-4">
									<p className="text-sm text-gray-600 line-clamp-2">
										{friend.bio}
									</p>

									<div className="flex flex-wrap gap-1">
										{friend.languages.slice(0, 3).map((lang) => (
											<Badge
												key={lang}
												className="text-xs bg-purple-100 text-purple-700 border-0"
											>
												{lang}
											</Badge>
										))}
									</div>

									<div className="flex items-center justify-between text-xs text-gray-500">
										<div className="flex items-center space-x-3">
											<span className="flex items-center space-x-1">
												<Users className="w-3 h-3" />
												<span>{friend.followers}</span>
											</span>
											<span className="flex items-center space-x-1">
												<Code2 className="w-3 h-3" />
												<span>{friend.publicRepos}</span>
											</span>
										</div>
									</div>

									<div className="flex space-x-2">
										<Button
											size="sm"
											onClick={() => handleFollow(friend.id)}
											className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700"
										>
											<UserPlus className="w-4 h-4 mr-2" />
											Follow
										</Button>
										<Button
											variant="outline"
											size="sm"
											className="border-purple-200 hover:bg-purple-50"
										>
											<ExternalLink className="w-4 h-4" />
										</Button>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				</TabsContent>
			</Tabs>
		</div>
	);
}
