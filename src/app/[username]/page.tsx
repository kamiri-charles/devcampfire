"use client";

import { useEffect, useState } from "react";
import AppSidebar from "@/components/app-sidebar";
import MobileNav from "@/components/mobile-nav";
import Dashboard from "@/components/dashboard";
import ChatSection from "@/components/chat-section";
import ProfileSection from "@/components/profile-section";
import CollaborationSection from "@/components/collab-section";
import DiscoverySection from "@/components/discovery-section";
import DirectMessages from "@/components/direct-messages";
import FriendsSection from "@/components/friends-section";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { signOut, useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import { RepoType } from "@/types/github";

export default function UserPage() {
	const [user, setUser] = useState<any>(null);
	const [currentSection, setCurrentSection] = useState("dashboard");
	const [privateChatId, setPrivateChatId] = useState<string | null>(null);
	const { data: session, status } = useSession();
	const router = useRouter();
	const [languages, setLanguages] = useState<string[]>([]);
	const [loadingLanguages, setLoadingLanguages] = useState(true);
	const [repos, setRepos] = useState<RepoType[]>([]);
	const [loadingRepos, setLoadingRepos] = useState(true);

	// Mock GitHub login
	const mockUser = {
		id: "123",
		login: "devuser",
		name: "Alex Developer",
		avatar_url:
			"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
		bio: "Full-stack developer passionate about open source",
		public_repos: 42,
		followers: 156,
		following: 98,
		languages: ["JavaScript", "TypeScript", "React", "Node.js", "Python"],
		repos: [
			{
				id: 1,
				name: "awesome-react-components",
				description: "A collection of reusable React components",
				language: "TypeScript",
				stars: 234,
				forks: 45,
			},
			{
				id: 2,
				name: "api-gateway-middleware",
				description: "Express middleware for API rate limiting and auth",
				language: "Node.js",
				stars: 89,
				forks: 23,
			},
		],
	};

	useEffect(() => {
		setUser(mockUser);
		if (status === "unauthenticated") redirect("/welcome");

		const fetchLanguages = async () => {
			try {
				const res = await fetch("/api/github/languages");
				if (res.ok) {
					const data = await res.json();
					setLanguages(data.topLanguages);
				}
			} catch (e) {
				console.error(e);
			} finally {
				setLoadingLanguages(false);
			}
		};
		fetchLanguages();

		const fetchRepos = async () => {
			try {
				const res = await fetch("/api/github/repos");
				if (res.ok) {
					const data = await res.json();
					setRepos(data);
				}
			} catch (e) {
				console.error(e);
			} finally {
				setLoadingRepos(false);
			}
		};

		fetchRepos();
	}, [status, router]);

	const handleLogout = () => {
		setCurrentSection("dashboard");
		setPrivateChatId(null);
		signOut({ redirectTo: "/welcome" });
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
						session={session}
						user={user}
						repoCount={repos.length}
						onSectionChange={setCurrentSection}
						onStartPrivateChat={handleStartPrivateChat}
					/>
				);
			case "chat":
				return <ChatSection user={user} />;
			case "messages":
				return (
					<DirectMessages
						chatId={privateChatId || undefined}
						onBack={handleBackFromMessages}
					/>
				);
			case "profile":
				return (
					<ProfileSection
						session={session}
						languages={languages}
						loadingLanguages={loadingLanguages}
						repos={repos}
						loadingRepos={loadingRepos}
					/>
				);
			case "collaboration":
				return <CollaborationSection user={user} />;
			case "discovery":
				return <DiscoverySection user={user} />;
			case "friends":
				return (
					<FriendsSection
						user={user}
						onStartPrivateChat={handleStartPrivateChat}
					/>
				);
			default:
				return (
					<Dashboard
						session={session}
						user={user}
						repoCount={repos.length}
						onSectionChange={setCurrentSection}
						onStartPrivateChat={handleStartPrivateChat}
					/>
				);
		}
	};

	return (
		<div className="h-screen w-screen flex bg-gradient-to-br from-purple-50 to-orange-50">
			{/* Desktop Sidebar */}
			<div className="hidden md:block">
				<AppSidebar
					session={session}
					currentSection={currentSection}
					onSectionChange={setCurrentSection}
					onLogout={handleLogout}
				/>
			</div>

			{/* Main Content */}
			<SidebarInset className="flex-1">
				<div className="flex flex-col min-h-screen">
					{/* Header with Sidebar Trigger (visible on desktop when sidebar is collapsed) */}
					<header className="hidden md:flex h-14 shrink-0 items-center gap-2 border-b border-purple-200/50 bg-white/50 px-4">
						<SidebarTrigger className="-ml-1" />
					</header>

					{/* Main Content Area */}
					<div className="flex-1 pb-16 md:pb-0">{renderCurrentSection()}</div>

					{/* Mobile Navigation */}
					<MobileNav
						currentSection={currentSection}
						onSectionChange={setCurrentSection}
						unreadMessages={5}
						unreadNotifications={3}
					/>
				</div>
			</SidebarInset>
		</div>
	);
}
