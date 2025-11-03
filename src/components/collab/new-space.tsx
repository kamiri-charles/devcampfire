import { Dispatch, SetStateAction, useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Loader2, Plus } from "lucide-react";
import { Badge } from "../ui/badge";

interface NewSpaceProps {
	isCreateDialogOpen: boolean;
	setIsCreateDialogOpen: Dispatch<SetStateAction<boolean>>;
}

export function NewSpace({
	isCreateDialogOpen,
	setIsCreateDialogOpen,
}: NewSpaceProps) {
	const [creatingProject, setCreatingProject] = useState(false);
	const [projectName, setProjectName] = useState("");
	const [description, setDescription] = useState("");
	const [repoUrl, setRepoUrl] = useState("");
	const [privacy, setPrivacy] = useState("private");

	const handle_create_space = async () => {
		if (!projectName) {
			alert("Project name is required");
			return;
		}

		try {
			setCreatingProject(true);
			fetch("/api/db/projects", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					name: projectName,
					description,
					repoUrl,
					type: privacy,
				}),
			}).then(async (res) => {
				if (res.ok) {
					alert("Project created successfully!");
					setIsCreateDialogOpen(false);
                    // TODO: Refresh project list
				} else {
					const errorData = await res.json();
					alert("Error creating project: " + errorData.message);
				}
			});
		} catch (error) {
			console.error("Error creating project:", error);
			alert("Failed to create project. Please try again.");
		} finally {
			setCreatingProject(false);
		}
	};
	return (
		<Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
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
						<Label htmlFor="space-name">Project Name</Label>
						<Input
							id="space-name"
							className="my-2"
							placeholder="My Awesome Project"
							value={projectName}
							onChange={(e) => setProjectName(e.target.value)}
						/>
					</div>
					<div>
						<Label htmlFor="space-description">Description</Label>
						<Textarea
							id="space-description"
							className="my-2"
							placeholder="Brief description of your project..."
							rows={3}
							value={description}
							onChange={(e) => setDescription(e.target.value)}
						/>
					</div>
					<div>
						<Label htmlFor="repo-url">GitHub Repository (Optional)</Label>
						<Input
							id="repo-url"
							className="my-2"
							placeholder="https://github.com/username/repo"
							value={repoUrl}
							onChange={(e) => setRepoUrl(e.target.value)}
						/>
					</div>
					<div>
						<Label htmlFor="privacy">Privacy</Label>
						<Select value={privacy} onValueChange={setPrivacy}>
							<SelectTrigger>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="public">Public - Anyone can join</SelectItem>
								<SelectItem value="private">Private - Invite only</SelectItem>
								<SelectItem value="internal" disabled>
									Internal - Organization members only
									<Badge>Pro</Badge>
								</SelectItem>
							</SelectContent>
						</Select>
					</div>
					<Button
						className="w-full bg-gradient-to-br from-purple-500 to-purple-600 cursor-pointer text-white hover:from-purple-600 hover:to-purple-700"
						onClick={handle_create_space}
						disabled={creatingProject}
					>
						{creatingProject ? (
							<Loader2 className="animate-spin" />
						) : (
							"Create Space"
						)}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
