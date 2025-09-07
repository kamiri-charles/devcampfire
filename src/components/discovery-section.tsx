import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "./ui/select";
import {
	Search,
	Users,
	Github,
	MapPin,
	Star,
	MessageCircle,
	Filter,
} from "lucide-react";

interface DiscoverySectionProps {
	user: any;
}

const mockDevelopers = [
	{
		id: 1,
		name: "Sarah Chen",
		login: "sarahc",
		avatar:
			"https://images.unsplash.com/photo-1494790108755-2616b5b2aca3?w=400&h=400&fit=crop&crop=face",
		bio: "Frontend developer passionate about React and user experience design",
		location: "San Francisco, CA",
		languages: ["JavaScript", "React", "TypeScript", "CSS"],
		repos: 24,
		followers: 156,
		topRepo: "react-component-library",
		repoStars: 89,
		lookingFor: "Open source collaboration",
	},
	{
		id: 2,
		name: "Mike Rodriguez",
		login: "mikecodes",
		avatar:
			"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
		bio: "Full-stack engineer building scalable web applications",
		location: "Austin, TX",
		languages: ["Node.js", "Python", "Docker", "AWS"],
		repos: 31,
		followers: 203,
		topRepo: "microservices-starter",
		repoStars: 156,
		lookingFor: "Startup opportunities",
	},
	{
		id: 3,
		name: "Emma Wilson",
		login: "emmacodes",
		avatar:
			"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
		bio: "AI/ML engineer with a passion for computer vision and NLP",
		location: "Seattle, WA",
		languages: ["Python", "TensorFlow", "PyTorch", "Jupyter"],
		repos: 18,
		followers: 342,
		topRepo: "vision-transformer-impl",
		repoStars: 234,
		lookingFor: "Research collaboration",
	},
	{
		id: 4,
		name: "David Kim",
		login: "davidk",
		avatar:
			"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face",
		bio: "Mobile developer specializing in React Native and Flutter",
		location: "New York, NY",
		languages: ["React Native", "Flutter", "Dart", "Swift"],
		repos: 27,
		followers: 98,
		topRepo: "cross-platform-toolkit",
		repoStars: 67,
		lookingFor: "Mobile app projects",
	},
	{
		id: 5,
		name: "Lisa Zhang",
		login: "lisaz",
		avatar:
			"https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face",
		bio: "DevOps engineer passionate about infrastructure and automation",
		location: "Vancouver, BC",
		languages: ["Kubernetes", "Terraform", "Go", "Bash"],
		repos: 22,
		followers: 124,
		topRepo: "k8s-deployment-tools",
		repoStars: 78,
		lookingFor: "Infrastructure projects",
	},
];

const mockProjects = [
	{
		id: 1,
		name: "Open Source CMS",
		description:
			"A modern content management system built with Next.js and Prisma",
		author: "Sarah Chen",
		authorAvatar:
			"https://images.unsplash.com/photo-1494790108755-2616b5b2aca3?w=400&h=400&fit=crop&crop=face",
		languages: ["Next.js", "Prisma", "TypeScript"],
		stars: 234,
		lookingFor: "Contributors",
		category: "Web Development",
	},
	{
		id: 2,
		name: "AI Code Assistant",
		description:
			"VS Code extension that provides intelligent code suggestions using GPT",
		author: "Emma Wilson",
		authorAvatar:
			"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
		languages: ["TypeScript", "Python", "OpenAI API"],
		stars: 567,
		lookingFor: "Beta testers",
		category: "Developer Tools",
	},
	{
		id: 3,
		name: "Blockchain Voting System",
		description:
			"Secure and transparent voting platform using Ethereum smart contracts",
		author: "Mike Rodriguez",
		authorAvatar:
			"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
		languages: ["Solidity", "Web3.js", "React"],
		stars: 89,
		lookingFor: "Co-maintainer",
		category: "Blockchain",
	},
];

export default function DiscoverySection({ user }: DiscoverySectionProps) {
	const [searchQuery, setSearchQuery] = useState("");
	const [languageFilter, setLanguageFilter] = useState("all");
	const [locationFilter, setLocationFilter] = useState("all");

	const filteredDevelopers = mockDevelopers.filter((dev) => {
		const matchesSearch =
			dev.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			dev.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
			dev.languages.some((lang) =>
				lang.toLowerCase().includes(searchQuery.toLowerCase())
			);

		const matchesLanguage =
			languageFilter === "all" ||
			dev.languages.some(
				(lang) => lang.toLowerCase() === languageFilter.toLowerCase()
			);

		const matchesLocation =
			locationFilter === "all" ||
			dev.location.toLowerCase().includes(locationFilter.toLowerCase());

		return matchesSearch && matchesLanguage && matchesLocation;
	});

	const filteredProjects = mockProjects.filter(
		(project) =>
			project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
			project.languages.some((lang) =>
				lang.toLowerCase().includes(searchQuery.toLowerCase())
			)
	);

	return (
		<div className="flex-1 p-6 overflow-y-auto">
			<div className="max-w-6xl mx-auto space-y-6">
				{/* Header */}
				<div>
					<h1>Discovery</h1>
					<p className="text-muted-foreground">
						Find developers by skills, projects, or interests
					</p>
				</div>

				{/* Search and Filters */}
				<div className="flex flex-col sm:flex-row gap-4">
					<div className="relative flex-1">
						<Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
						<Input
							placeholder="Search developers, projects, or technologies..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="pl-10"
						/>
					</div>
					<div className="flex gap-2">
						<Select value={languageFilter} onValueChange={setLanguageFilter}>
							<SelectTrigger className="w-40">
								<Filter className="w-4 h-4 mr-2" />
								<SelectValue placeholder="Language" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Languages</SelectItem>
								<SelectItem value="javascript">JavaScript</SelectItem>
								<SelectItem value="python">Python</SelectItem>
								<SelectItem value="react">React</SelectItem>
								<SelectItem value="typescript">TypeScript</SelectItem>
								<SelectItem value="node.js">Node.js</SelectItem>
							</SelectContent>
						</Select>
						<Select value={locationFilter} onValueChange={setLocationFilter}>
							<SelectTrigger className="w-32">
								<SelectValue placeholder="Location" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Locations</SelectItem>
								<SelectItem value="san francisco">San Francisco</SelectItem>
								<SelectItem value="new york">New York</SelectItem>
								<SelectItem value="seattle">Seattle</SelectItem>
								<SelectItem value="austin">Austin</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>

				{/* Tabs */}
				<Tabs defaultValue="developers" className="space-y-6">
					<TabsList>
						<TabsTrigger value="developers">Developers</TabsTrigger>
						<TabsTrigger value="projects">Projects</TabsTrigger>
						<TabsTrigger value="trending">Trending</TabsTrigger>
					</TabsList>

					<TabsContent value="developers" className="space-y-4">
						<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
							{filteredDevelopers.map((dev) => (
								<Card
									key={dev.id}
									className="hover:shadow-md transition-shadow"
								>
									<CardHeader className="pb-3">
										<div className="flex items-start space-x-3">
											<Avatar className="w-12 h-12">
												<AvatarImage src={dev.avatar} />
												<AvatarFallback>{dev.name[0]}</AvatarFallback>
											</Avatar>
											<div className="flex-1 min-w-0">
												<CardTitle className="text-lg truncate">
													{dev.name}
												</CardTitle>
												<p className="text-sm text-muted-foreground">
													@{dev.login}
												</p>
												<div className="flex items-center space-x-1 text-xs text-muted-foreground mt-1">
													<MapPin className="w-3 h-3" />
													<span>{dev.location}</span>
												</div>
											</div>
										</div>
										<CardDescription className="text-sm line-clamp-2 mt-2">
											{dev.bio}
										</CardDescription>
									</CardHeader>
									<CardContent className="space-y-3">
										{/* Stats */}
										<div className="flex items-center space-x-4 text-sm text-muted-foreground">
											<div className="flex items-center space-x-1">
												<Github className="w-3 h-3" />
												<span>{dev.repos} repos</span>
											</div>
											<div className="flex items-center space-x-1">
												<Users className="w-3 h-3" />
												<span>{dev.followers} followers</span>
											</div>
										</div>

										{/* Languages */}
										<div className="flex flex-wrap gap-1">
											{dev.languages.slice(0, 3).map((lang) => (
												<Badge key={lang} variant="outline" className="text-xs">
													{lang}
												</Badge>
											))}
											{dev.languages.length > 3 && (
												<Badge variant="secondary" className="text-xs">
													+{dev.languages.length - 3}
												</Badge>
											)}
										</div>

										{/* Top Repository */}
										<div className="bg-muted/30 rounded-lg p-2">
											<div className="flex items-center justify-between text-xs">
												<span className="font-medium truncate">
													{dev.topRepo}
												</span>
												<div className="flex items-center space-x-1 text-muted-foreground">
													<Star className="w-3 h-3" />
													<span>{dev.repoStars}</span>
												</div>
											</div>
										</div>

										{/* Looking for */}
										<div className="text-xs">
											<span className="text-muted-foreground">
												Looking for:{" "}
											</span>
											<Badge variant="secondary" className="text-xs">
												{dev.lookingFor}
											</Badge>
										</div>

										{/* Actions */}
										<div className="flex space-x-2 pt-2">
											<Button variant="outline" size="sm" className="flex-1">
												<MessageCircle className="w-3 h-3 mr-1" />
												Connect
											</Button>
											<Button variant="ghost" size="sm">
												<Github className="w-3 h-3" />
											</Button>
										</div>
									</CardContent>
								</Card>
							))}
						</div>
					</TabsContent>

					<TabsContent value="projects" className="space-y-4">
						<div className="grid gap-4 md:grid-cols-2">
							{filteredProjects.map((project) => (
								<Card
									key={project.id}
									className="hover:shadow-md transition-shadow"
								>
									<CardHeader>
										<div className="flex items-start justify-between">
											<div className="flex-1">
												<CardTitle className="text-lg mb-1">
													{project.name}
												</CardTitle>
												<Badge variant="outline" className="text-xs mb-2">
													{project.category}
												</Badge>
											</div>
											<div className="flex items-center space-x-1 text-sm text-muted-foreground">
												<Star className="w-4 h-4" />
												<span>{project.stars}</span>
											</div>
										</div>
										<CardDescription>{project.description}</CardDescription>
									</CardHeader>
									<CardContent className="space-y-3">
										{/* Author */}
										<div className="flex items-center space-x-2">
											<Avatar className="w-6 h-6">
												<AvatarImage src={project.authorAvatar} />
												<AvatarFallback className="text-xs">
													{project.author[0]}
												</AvatarFallback>
											</Avatar>
											<span className="text-sm text-muted-foreground">
												by {project.author}
											</span>
										</div>

										{/* Technologies */}
										<div className="flex flex-wrap gap-1">
											{project.languages.map((lang) => (
												<Badge key={lang} variant="outline" className="text-xs">
													{lang}
												</Badge>
											))}
										</div>

										{/* Looking for */}
										<div className="text-sm">
											<span className="text-muted-foreground">
												Looking for:{" "}
											</span>
											<Badge variant="secondary" className="text-xs">
												{project.lookingFor}
											</Badge>
										</div>

										{/* Actions */}
										<div className="flex space-x-2 pt-2">
											<Button variant="outline" size="sm" className="flex-1">
												<MessageCircle className="w-3 h-3 mr-1" />
												Get Involved
											</Button>
											<Button variant="ghost" size="sm">
												<Github className="w-3 h-3" />
											</Button>
										</div>
									</CardContent>
								</Card>
							))}
						</div>
					</TabsContent>

					<TabsContent value="trending" className="space-y-4">
						<div className="text-center py-8">
							<Star className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
							<h3>Trending Content</h3>
							<p className="text-muted-foreground">
								Discover the most popular developers and projects this week
							</p>
						</div>
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
}
