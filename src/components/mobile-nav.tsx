import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
	Home,
	MessageCircle,
	User,
	Search,
	Send,
	Heart,
} from "lucide-react";

interface MobileNavProps {
	currentSection: string;
	onSectionChange: (section: string) => void;
	unreadMessages?: number;
	unreadNotifications?: number;
}

export default function MobileNav({
	currentSection,
	onSectionChange,
	unreadMessages = 0,
	unreadNotifications = 0,
}: MobileNavProps) {
	const navItems = [
		{
			id: "dashboard",
			label: "Home",
			icon: Home,
			badge: unreadNotifications,
		},
		{
			id: "chat",
			label: "Chats",
			icon: MessageCircle,
			badge: unreadMessages,
		},
		{
			id: "messages",
			label: "DMs",
			icon: Send,
			badge: 0,
		},
		{
			id: "friends",
			label: "Friends",
			icon: Heart,
			badge: 0,
		},
		{
			id: "discovery",
			label: "Discover",
			icon: Search,
			badge: 0,
		},
		{
			id: "profile",
			label: "Profile",
			icon: User,
			badge: 0,
		},
	];

	return (
		<div className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border backdrop-blur-sm z-50">
			<div className="flex items-center justify-around py-2 px-4">
				{navItems.map((item) => {
					const Icon = item.icon;
					const isActive = currentSection === item.id;

					return (
						<Button
							key={item.id}
							variant="ghost"
							size="sm"
							className={`flex flex-col items-center space-y-1 h-auto py-2 px-3 relative ${
								isActive
									? "text-purple-700 bg-purple-100 border border-purple-200 rounded-lg"
									: "text-gray-600 hover:text-purple-600 hover:bg-purple-50"
							}`}
							onClick={() => onSectionChange(item.id)}
						>
							<div className="relative">
								<Icon className="w-5 h-5" />
								{item.badge > 0 && (
									<Badge className="absolute -top-2 -right-2 w-4 h-4 p-0 flex items-center justify-center bg-gradient-to-r from-orange-400 to-orange-500 text-white border-0 text-xs">
										{item.badge > 9 ? "9+" : item.badge}
									</Badge>
								)}
							</div>
							<span className="text-xs">{item.label}</span>
						</Button>
					);
				})}
			</div>
		</div>
	);
}
