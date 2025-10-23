import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { TabsContent } from '../ui/tabs';
import { Button } from '../ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { MapPin, Github, Users, Star, MessageCircle } from 'lucide-react';

interface DevelopersProps {
    searchQuery: string;
    languageFilter: string;
    locationFilter: string;
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
];

export function Developers({searchQuery, languageFilter, locationFilter}: DevelopersProps) {
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

  return (
		<TabsContent value="developers" className="space-y-4">
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				{filteredDevelopers.map((dev) => (
					<Card key={dev.id} className="hover:shadow-md transition-shadow">
						<CardHeader className="pb-3">
							<div className="flex items-start space-x-3">
								<Avatar className="w-12 h-12">
									<AvatarImage src={dev.avatar} />
									<AvatarFallback>{dev.name[0]}</AvatarFallback>
								</Avatar>
								<div className="flex-1 min-w-0">
									<CardTitle className="text-lg truncate">{dev.name}</CardTitle>
									<p className="text-sm text-muted-foreground">@{dev.login}</p>
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
									<span className="font-medium truncate">{dev.topRepo}</span>
									<div className="flex items-center space-x-1 text-muted-foreground">
										<Star className="w-3 h-3" />
										<span>{dev.repoStars}</span>
									</div>
								</div>
							</div>

							{/* Looking for */}
							<div className="text-xs">
								<span className="text-muted-foreground">Looking for: </span>
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
	);
}
