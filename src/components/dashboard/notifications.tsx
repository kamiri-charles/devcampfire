import { useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Bell, Loader2 } from "lucide-react";


interface Notification {
	id: string;
	type: string;
	title: string;
	message: string;
	time: string;
	avatar: string;
	seen: boolean;
}

export function Notifications() {
	const [notifications, setNotifications] = useState<Notification[]>([]);
	const [loadingNotifications, setLoadingNotifications] = useState(false);

	const displayCardContent = () => {
		if (loadingNotifications) {
			return(
			<div className="flex justify-center items-center h-40">
				<Loader2 className="animate-spin" />
			</div>)
		}
		else if (notifications.length === 0) {
			return <p className="text-sm text-gray-500">No new notifications</p>;
		} else {
			return (
				<div className="space-y-3">
					{notifications.map((notification) => (
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
				</div>
			);
		}

	}
  return (
		<Card className="lg:min-h-[300px]">
			<CardHeader>
				<CardTitle className="flex items-center space-x-2">
					<Bell className="w-5 h-5 text-orange-500" />
					<span>Notifications</span>
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-3">
				{displayCardContent()}
			</CardContent>
		</Card>
	);
}