import { useState } from "react";
import { Input } from "../ui/input";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";
import {
	Search,
	Filter,
} from "lucide-react";
import { Developers } from "./developers";
import { Projects } from "./projects";
import { Trending } from "./trending";

export default function Discovery() {
	const [searchQuery, setSearchQuery] = useState("");
	const [languageFilter, setLanguageFilter] = useState("all");
	const [locationFilter, setLocationFilter] = useState("all");

	return (
		<div className="flex-1 p-6 overflow-y-auto">
			<div className="max-w-6xl mx-auto space-y-6">
				<div>
					<h1>Discovery</h1>
					<p className="text-muted-foreground">
						Find developers by skills, projects, or interests
					</p>
				</div>

				{/* Search and filters */}
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

				<Tabs defaultValue="developers" className="space-y-6">
					<TabsList>
						<TabsTrigger value="developers">Developers</TabsTrigger>
						<TabsTrigger value="projects">Projects</TabsTrigger>
						<TabsTrigger value="trending">Trending</TabsTrigger>
					</TabsList>

					<Developers searchQuery={searchQuery} languageFilter={languageFilter} locationFilter={locationFilter} />
					<Projects searchQuery={searchQuery} />
					<Trending />
				</Tabs>
			</div>
		</div>
	);
}
