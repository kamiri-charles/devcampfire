import { Button } from "./ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "./ui/card";
import { Github, Sparkles } from "lucide-react";


export default function GetStarted() {
	const handleGitHubLogin = () => {
		// Mock GitHub login
		const mockUser = {
			id: "123",
			login: "devuser",
			name: "Alex Developer",
			avatar_url:
				"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
			bio: "Full-stack developer passionate about open source",
			public_repos: 42,
			followers: 156,
			following: 98,
			languages: ["JavaScript", "TypeScript", "React", "Node.js", "Python"],
			repos: [
				{
					id: 1,
					name: "awesome-react-components",
					description: "A collection of reusable React components",
					language: "TypeScript",
					stars: 234,
					forks: 45,
				},
				{
					id: 2,
					name: "api-gateway-middleware",
					description: "Express middleware for API rate limiting and auth",
					language: "Node.js",
					stars: 89,
					forks: 23,
				},
			],
		};
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-orange-600 flex items-center justify-center p-4">
			<div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>

			<Card className="w-full max-w-md backdrop-blur-sm bg-white/95 border-0 shadow-2xl">
				<CardHeader className="text-center space-y-6 pb-8">
					<div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
						<Sparkles className="w-8 h-8 text-white" />
					</div>
					<div>
						<CardTitle className="text-2xl bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent mb-2">
							Welcome to Dev Campfire
						</CardTitle>
						<CardDescription className="text-base">
							Join the community where developers connect, collaborate, and grow
							together ✨
						</CardDescription>
					</div>
				</CardHeader>
				<CardContent className="space-y-4">
					<Button
						onClick={handleGitHubLogin}
						className="w-full h-12 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-lg hover:shadow-xl transition-all duration-200"
						size="lg"
					>
						<Github className="w-5 h-5 mr-3" />
						Continue with GitHub
					</Button>
					<p className="text-sm text-muted-foreground text-center">
						Your profile will auto-import your repositories and languages
					</p>

					<div className="pt-4 text-center">
						<div className="grid grid-cols-3 gap-4 text-xs text-muted-foreground">
							<div className="flex flex-col items-center space-y-1">
								<div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center">
									<Github className="w-4 h-4 text-white" />
								</div>
								<span>Connect</span>
							</div>
							<div className="flex flex-col items-center space-y-1">
								<div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-lg flex items-center justify-center">
									<Sparkles className="w-4 h-4 text-white" />
								</div>
								<span>Collaborate</span>
							</div>
							<div className="flex flex-col items-center space-y-1">
								<div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center">
									<Sparkles className="w-4 h-4 text-white" />
								</div>
								<span>Grow</span>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
