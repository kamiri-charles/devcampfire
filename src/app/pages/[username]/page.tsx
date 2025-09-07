import { useState } from "react";
import AppSidebar from "@/components/app-sidebar";
import MobileNav from "@/components/mobile-nav";
import Dashboard from "@/components/dashboard";
import ChatSection from "@/components/chat-section";
import ProfileSection from "@/components/profile-section";
import CollaborationSection from "@/components/collab-section";
import DiscoverySection from "@/components/discovery-section";
import PrivateMessaging from "@/components/private-messaging";

export default function UserPage() {
	const [user, setUser] = useState(null);
	const [currentSection, setCurrentSection] = useState("dashboard");
	const [privateChatId, setPrivateChatId] = useState<string | null>(null);


	const handleLogout = () => {
		setUser(null);
		setCurrentSection("dashboard");
		setPrivateChatId(null);
	};

	const handleStartPrivateChat = (userId: string) => {
		setPrivateChatId(userId);
		setCurrentSection("messages");
	};

	const handleBackFromMessages = () => {
		setPrivateChatId(null);
		setCurrentSection("dashboard");
	};

	const renderCurrentSection = () => {
		switch (currentSection) {
			case "dashboard":
				return (
					<Dashboard
						user={user}
						onSectionChange={setCurrentSection}
						onStartPrivateChat={handleStartPrivateChat}
					/>
				);
			case "chat":
				return <ChatSection user={user} />;
			case "messages":
				return (
					<PrivateMessaging
						user={user}
						chatId={privateChatId || undefined}
						onBack={handleBackFromMessages}
					/>
				);
			case "profile":
				return <ProfileSection user={user} />;
			case "collaboration":
				return <CollaborationSection user={user} />;
			case "discovery":
				return <DiscoverySection user={user} />;
			default:
				return (
					<Dashboard
						user={user}
						onSectionChange={setCurrentSection}
						onStartPrivateChat={handleStartPrivateChat}
					/>
				);
		}
	};

	return (
		<div className="h-screen flex bg-gradient-to-br from-purple-50 to-orange-50">
			{/* Desktop Sidebar */}
			<div className="hidden md:block">
				<AppSidebar
					user={user}
					currentSection={currentSection}
					onSectionChange={setCurrentSection}
					onLogout={handleLogout}
				/>
			</div>

			{/* Main Content */}
			<div className="flex-1 flex flex-col">
				<div className="flex-1 pb-16 md:pb-0">{renderCurrentSection()}</div>

				{/* Mobile Navigation */}
				<MobileNav
					currentSection={currentSection}
					onSectionChange={setCurrentSection}
					unreadMessages={5}
					unreadNotifications={3}
				/>
			</div>
		</div>
	);
}
