import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { TrendingUp } from "lucide-react";

const mockTrendingTopics = [
	{ name: "React Server Components", posts: 23 },
	{ name: "TypeScript 5.0", posts: 18 },
	{ name: "AI Code Generation", posts: 15 },
	{ name: "Web3 Development", posts: 12 },
];

export function Trending() {
  return (
		<Card className="lg:min-h-[250px]">
			<CardHeader>
				<CardTitle className="flex items-center space-x-2">
					<TrendingUp className="w-5 h-5 text-emerald-500" />
					<span>Trending</span>
				</CardTitle>
				<CardDescription>Popular topics this week</CardDescription>
			</CardHeader>
			<CardContent className="space-y-3">
				{mockTrendingTopics.map((topic, index) => (
					<div
						key={index}
						className="flex items-center justify-between p-3 rounded-lg hover:bg-emerald-50 cursor-pointer border border-transparent hover:border-emerald-200 transition-colors"
					>
						<div className="flex items-center space-x-3">
							<div
								className={`w-3 h-3 rounded-full ${
									index === 0
										? "bg-purple-500"
										: index === 1
										? "bg-cyan-500"
										: index === 2
										? "bg-emerald-500"
										: "bg-orange-500"
								}`}
							/>
							<span className="text-sm font-medium text-gray-900">
								{topic.name}
							</span>
						</div>
						<Badge
							variant="outline"
							className="text-xs bg-white border-gray-200 text-gray-700"
						>
							{topic.posts}
						</Badge>
					</div>
				))}
			</CardContent>
		</Card>
	);
}

