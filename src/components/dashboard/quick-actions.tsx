import { Dispatch, SetStateAction } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { User, Plus, Send } from "lucide-react";

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
					variant="outline"
					className="w-full justify-start h-12 bg-white hover:bg-purple-50 border-purple-200 hover:border-purple-300 cursor-pointer"
					onClick={() => setCurrentSection("collaboration")}
				>
					<Plus className="w-4 h-4 mr-3" />
					Start Project
				</Button>
				<Button
					variant="outline"
					className="w-full justify-start h-12 bg-white hover:bg-orange-50 border-orange-200 hover:border-orange-300 cursor-pointer"
					onClick={() => setCurrentSection("messages")}
				>
					<Send className="w-4 h-4 mr-3" />
					Send Message
				</Button>
			</CardContent>
		</Card>
	);
}

