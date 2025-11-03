import { Dispatch, SetStateAction } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { User, Folder, Send } from "lucide-react";

interface QuickActionsProps {
    setCurrentSection: Dispatch<SetStateAction<string>>;
}

export function QuickActions({ setCurrentSection }: QuickActionsProps) {
  return (
		<Card className="lg:min-h-[200px]">
			<CardHeader>
				<CardTitle>Quick Actions</CardTitle>
				<CardDescription>Get started with these common tasks</CardDescription>
			</CardHeader>
			<CardContent className="space-y-3">
				<Button
					className="w-full justify-start bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 h-12 cursor-pointer"
					onClick={() => setCurrentSection("discovery")}
				>
					<User className="w-4 h-4 mr-3" />
					Find Developers
				</Button>
				<Button
					className="w-full justify-start bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 h-12 cursor-pointer"
					onClick={() => setCurrentSection("dms")}
				>
					<Send className="w-4 h-4 mr-3" />
					View Messages
				</Button>
				<Button
					className="w-full justify-start bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 h-12 cursor-pointer"
					onClick={() => setCurrentSection("collab")}
				>
					<Folder className="w-4 h-4 mr-3" />
					Explore Projects
				</Button>
			</CardContent>
		</Card>
	);
}

