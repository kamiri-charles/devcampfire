import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { TabsContent } from "../ui/tabs";
import { Star, MessageCircle, Github } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";

interface ProjectsProps {
    searchQuery: string;
}

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

export function Projects({ searchQuery }: ProjectsProps) {
    const filteredProjects = mockProjects.filter(
			(project) =>
				project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
				project.languages.some((lang) =>
					lang.toLowerCase().includes(searchQuery.toLowerCase())
				)
		);
  return (
		<TabsContent value="projects" className="space-y-4">
			<div className="grid gap-4 md:grid-cols-2">
				{filteredProjects.map((project) => (
					<Card key={project.id} className="hover:shadow-md transition-shadow">
						<CardHeader>
							<div className="flex items-start justify-between">
								<div className="flex-1">
									<CardTitle className="text-lg mb-1">{project.name}</CardTitle>
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
								<span className="text-muted-foreground">Looking for: </span>
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
	);
}
