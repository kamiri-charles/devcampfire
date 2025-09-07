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
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "./ui/select";
import {
	Plus,
	Users,
	Github,
	MessageCircle,
	Calendar,
	Search,
} from "lucide-react";

interface CollaborationSectionProps {
	user: any;
}

const mockSpaces = [
	{
		id: 1,
		name: "React Native E-commerce App",
		description:
			"Building a cross-platform shopping app with React Native and Expo",
		repo: "github.com/teamdev/rn-ecommerce",
		members: [
			{
				name: "Alex Developer",
				avatar:
					"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
			},
			{
				name: "Sarah Chen",
				avatar:
					"https://images.unsplash.com/photo-1494790108755-2616b5b2aca3?w=400&h=400&fit=crop&crop=face",
			},
			{
				name: "Mike Rodriguez",
				avatar:
					"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
			},
		],
		languages: ["React Native", "TypeScript", "Node.js"],
		status: "Active",
		lastActivity: "2 hours ago",
	},
	{
		id: 2,
		name: "AI Code Review Tool",
		description:
			"Machine learning tool to automatically review code quality and suggest improvements",
		repo: "github.com/aidev/code-reviewer",
		members: [
			{
				name: "Emma Wilson",
				avatar:
					"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
			},
			{
				name: "Alex Developer",
				avatar:
					"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
			},
		],
		languages: ["Python", "TensorFlow", "FastAPI"],
		status: "Looking for contributors",
		lastActivity: "1 day ago",
	},
	{
		id: 3,
		name: "Open Source Design System",
		description: "A comprehensive design system for modern web applications",
		repo: "github.com/opensource/design-system",
		members: [
			{
				name: "David Kim",
				avatar:
					"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face",
			},
			{
				name: "Lisa Zhang",
				avatar:
					"https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face",
			},
		],
		languages: ["React", "Storybook", "CSS"],
		status: "Active",
		lastActivity: "3 hours ago",
	},
];

export default function CollaborationSection({
	user,
}: CollaborationSectionProps) {
	const [searchQuery, setSearchQuery] = useState("");
	const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

	const filteredSpaces = mockSpaces.filter(
		(space) =>
			space.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			space.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
			space.languages.some((lang) =>
				lang.toLowerCase().includes(searchQuery.toLowerCase())
			)
	);

	return (
		<div className="flex-1 p-6 overflow-y-auto">
			<div className="max-w-6xl mx-auto space-y-6">
				{/* Header */}
				<div className="flex items-center justify-between">
					<div>
						<h1>Collaboration Spaces</h1>
						<p className="text-muted-foreground">
							Work together on projects with repo-linked team rooms
						</p>
					</div>
					<Dialog
						open={isCreateDialogOpen}
						onOpenChange={setIsCreateDialogOpen}
					>
						<DialogTrigger asChild>
							<Button>
								<Plus className="w-4 h-4 mr-2" />
								Create Space
							</Button>
						</DialogTrigger>
						<DialogContent className="sm:max-w-md">
							<DialogHeader>
								<DialogTitle>Create Collaboration Space</DialogTitle>
								<DialogDescription>
									Create a new space for your project team
								</DialogDescription>
							</DialogHeader>
							<div className="space-y-4">
								<div>
									<Label htmlFor="space-name">Space Name</Label>
									<Input id="space-name" placeholder="My Awesome Project" />
								</div>
								<div>
									<Label htmlFor="space-description">Description</Label>
									<Textarea
										id="space-description"
										placeholder="Brief description of your project..."
										rows={3}
									/>
								</div>
								<div>
									<Label htmlFor="repo-url">GitHub Repository (Optional)</Label>
									<Input
										id="repo-url"
										placeholder="https://github.com/username/repo"
									/>
								</div>
								<div>
									<Label htmlFor="privacy">Privacy</Label>
									<Select defaultValue="public">
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="public">
												Public - Anyone can join
											</SelectItem>
											<SelectItem value="private">
												Private - Invite only
											</SelectItem>
										</SelectContent>
									</Select>
								</div>
								<Button
									className="w-full"
									onClick={() => setIsCreateDialogOpen(false)}
								>
									Create Space
								</Button>
							</div>
						</DialogContent>
					</Dialog>
				</div>

				{/* Search */}
				<div className="relative">
					<Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
					<Input
						placeholder="Search spaces by name, description, or technology..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="pl-10"
					/>
				</div>

				{/* Tabs */}
				<Tabs defaultValue="all" className="space-y-6">
					<TabsList>
						<TabsTrigger value="all">All Spaces</TabsTrigger>
						<TabsTrigger value="joined">My Spaces</TabsTrigger>
						<TabsTrigger value="owned">Created by Me</TabsTrigger>
					</TabsList>

					<TabsContent value="all" className="space-y-4">
						<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
							{filteredSpaces.map((space) => (
								<Card
									key={space.id}
									className="hover:shadow-md transition-shadow cursor-pointer"
								>
									<CardHeader className="pb-3">
										<div className="flex items-start justify-between">
											<div className="flex-1">
												<CardTitle className="text-lg mb-1">
													{space.name}
												</CardTitle>
												<div className="flex items-center space-x-2 mb-2">
													<Badge
														variant={
															space.status === "Active"
																? "default"
																: "secondary"
														}
														className="text-xs"
													>
														{space.status}
													</Badge>
													<span className="text-xs text-muted-foreground flex items-center">
														<Calendar className="w-3 h-3 mr-1" />
														{space.lastActivity}
													</span>
												</div>
											</div>
										</div>
										<CardDescription className="text-sm line-clamp-2">
											{space.description}
										</CardDescription>
									</CardHeader>
									<CardContent className="space-y-3">
										{/* Repository link */}
										<div className="flex items-center space-x-2 text-sm">
											<Github className="w-4 h-4 text-muted-foreground" />
											<span className="text-muted-foreground truncate">
												{space.repo}
											</span>
										</div>

										{/* Technologies */}
										<div className="flex flex-wrap gap-1">
											{space.languages.map((lang) => (
												<Badge key={lang} variant="outline" className="text-xs">
													{lang}
												</Badge>
											))}
										</div>

										{/* Members */}
										<div className="flex items-center space-x-2">
											<div className="flex -space-x-2">
												{space.members.slice(0, 3).map((member, index) => (
													<Avatar
														key={index}
														className="w-6 h-6 border-2 border-background"
													>
														<AvatarImage src={member.avatar} />
														<AvatarFallback className="text-xs">
															{member.name[0]}
														</AvatarFallback>
													</Avatar>
												))}
											</div>
											<span className="text-sm text-muted-foreground">
												<Users className="w-3 h-3 inline mr-1" />
												{space.members.length} members
											</span>
										</div>

										{/* Actions */}
										<div className="flex space-x-2 pt-2">
											<Button variant="outline" size="sm" className="flex-1">
												<MessageCircle className="w-3 h-3 mr-1" />
												Join
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

					<TabsContent value="joined" className="space-y-4">
						<div className="text-center py-8">
							<Users className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
							<h3>No spaces joined yet</h3>
							<p className="text-muted-foreground">
								Join collaboration spaces to start working with other developers
							</p>
						</div>
					</TabsContent>

					<TabsContent value="owned" className="space-y-4">
						<div className="text-center py-8">
							<Plus className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
							<h3>No spaces created yet</h3>
							<p className="text-muted-foreground mb-4">
								Create your first collaboration space to invite team members
							</p>
							<Button onClick={() => setIsCreateDialogOpen(true)}>
								<Plus className="w-4 h-4 mr-2" />
								Create Your First Space
							</Button>
						</div>
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
}
