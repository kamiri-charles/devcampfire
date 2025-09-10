import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Bell } from "lucide-react";

const mockNotifications = [
	{
		id: 1,
		type: "mention",
		title: "You were mentioned in #react",
		message: "Sarah Chen mentioned you in a discussion about hooks",
		time: "5m ago",
		avatar:
			"https://images.unsplash.com/photo-1494790108755-2616b5b2aca3?w=400&h=400&fit=crop&crop=face",
	},
	{
		id: 2,
		type: "message",
		title: "New private message",
		message: "Mike Rodriguez sent you a message",
		time: "12m ago",
		avatar:
			"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
	},
	{
		id: 3,
		type: "project",
		title: "Collaboration invite",
		message: "Emma Wilson invited you to join 'AI Code Assistant'",
		time: "1h ago",
		avatar:
			"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
	},
];

export function Notifications() {
  return (
		<Card className="lg:min-h-[300px]">
			<CardHeader>
				<CardTitle className="flex items-center space-x-2">
					<Bell className="w-5 h-5 text-orange-500" />
					<span>Notifications</span>
					<Badge className="bg-gradient-to-r from-orange-400 to-orange-500 text-white border-0">
						{mockNotifications.length}
					</Badge>
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-3">
				{mockNotifications.map((notification) => (
					<div
						key={notification.id}
						className="flex items-start space-x-3 p-2 rounded-lg hover:bg-orange-50 cursor-pointer border border-transparent hover:border-orange-200 transition-colors"
					>
						<Avatar className="w-8 h-8">
							<AvatarImage src={notification.avatar} />
							<AvatarFallback>
								<Bell className="w-4 h-4" />
							</AvatarFallback>
						</Avatar>
						<div className="flex-1 min-w-0">
							<p className="text-sm font-medium text-gray-900">
								{notification.title}
							</p>
							<p className="text-xs text-gray-600 line-clamp-2">
								{notification.message}
							</p>
							<p className="text-xs text-gray-500 mt-1">{notification.time}</p>
						</div>
					</div>
				))}
			</CardContent>
		</Card>
	);
}