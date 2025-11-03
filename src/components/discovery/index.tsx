import { useState } from "react";
import { Input } from "../ui/input";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { Search } from "lucide-react";
import { Developers } from "./developers";
import { Projects } from "./projects";
import { Trending } from "./trending";

export default function Discovery() {
	const [searchQuery, setSearchQuery] = useState("");

	return (
		<div className="flex-1 p-6 overflow-y-auto">
			<div className="max-w-6xl mx-auto space-y-6">
				<div>
					<h1>Discovery</h1>
					<p className="text-muted-foreground">
						Find developers by skills, projects, or interests
					</p>
				</div>

				{/* Search */}
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
				</div>

				<Tabs defaultValue="developers" className="space-y-6">
					<TabsList>
						<TabsTrigger value="developers">Developers</TabsTrigger>
						<TabsTrigger value="projects">Projects</TabsTrigger>
						<TabsTrigger value="trending">Trending</TabsTrigger>
					</TabsList>

					<Developers searchQuery={searchQuery} />
					<Projects searchQuery={searchQuery} />
					<Trending />
				</Tabs>
			</div>
		</div>
	);
}