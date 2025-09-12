"use client";

import { useEffect, useState } from "react";
import AppSidebar from "@/components/app-sidebar";
import MobileNav from "@/components/mobile-nav";
import Dashboard from "@/components/dashboard";
import RoomMessages from "@/components/room-messages";
import Profile from "@/components/profile";
import Collab from "@/components/collab";
import Discovery from "@/components/discovery";
import DirectMessages from "@/components/direct-messages";
import Friends from "@/components/friends";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { signOut, useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { GitHubConnections, RepoType } from "@/types/github";
import { DBConversation } from "@/db/schema";
import { DMConversation } from "@/types/db-customs";

export default function UserPage() {
	const [currentSection, setCurrentSection] = useState("dashboard");
	const [privateChatId, setPrivateChatId] = useState<string | null>(null);
	const [languages, setLanguages] = useState<string[]>([]);
	const [loadingLanguages, setLoadingLanguages] = useState(true);
	const [repos, setRepos] = useState<RepoType[]>([]);
	const [loadingRepos, setLoadingRepos] = useState(true);
	const [rooms, setRooms] = useState<DBConversation[]>([]);
	const [loadingRooms, setLoadingRooms] = useState(true);
	const [selectedRoom, setSelectedRoom] = useState<DBConversation | null>(null);
	const [githubConnections, setGitHubConnections] = useState<GitHubConnections | null>(null);
	const [loadingConnections, setLoadingConnections] = useState(true);
	const [dms, setDms] = useState<DMConversation[]>([]);
	const [loadingDms, setLoadingDms] = useState(true);
	const { data: session, status } = useSession();

	useEffect(() => {
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

		const fetchRooms = async () => {
			try {
				const res = await fetch("/api/db/conversations/rooms");
				if (res.ok) {
					const data = await res.json();
					setRooms(data);
				}
			} catch (e) {
				console.error(e);
			} finally {
				setLoadingRooms(false);
			}
		};
		fetchRooms();

		const fetchConnections = async () => {
			try {
				const res = await fetch("/api/github/connections");
				if (res.ok) {
					const data = await res.json();
					setGitHubConnections(data);
				}
			} catch (e) {
				console.error(e);
			} finally {
				setLoadingConnections(false);
			}
		};
		fetchConnections();

		const fetchDms = async () => {
			try {
				const res = await fetch("/api/db/users/conversations/me");
				if (res.ok) {
					const data = await res.json();
					setDms(data);
				}
			} catch (e) {
				console.error(e);
			} finally {
				setLoadingDms(false);
			}
		};
		fetchDms();

	}, [status]);

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
						repoCount={repos.length}
						onSectionChange={setCurrentSection}
						onStartPrivateChat={handleStartPrivateChat}
					/>
				);
			case "room":
				return <RoomMessages selectedRoom={selectedRoom} />;
			case "dms":
				return (
					<DirectMessages
						dms={dms}
						loadingDms={loadingDms}
						chatId={privateChatId}
						setCurrentSection={setCurrentSection}
						onBack={handleBackFromMessages}
					/>
				);
			case "profile":
				return (
					<Profile
						session={session}
						languages={languages}
						loadingLanguages={loadingLanguages}
						repos={repos}
						loadingRepos={loadingRepos}
					/>
				);
			case "collab":
				return <Collab />;
			case "discovery":
				return <Discovery />;
			case "friends":
				return (
					<Friends
						connections={githubConnections}
						loadingConnections={loadingConnections}
						setActiveSection={setCurrentSection}
						setChatId={setPrivateChatId}
					/>
				);
			default:
				return (
					<Dashboard
						session={session}
						repoCount={repos.length}
						onSectionChange={setCurrentSection}
						onStartPrivateChat={handleStartPrivateChat}
					/>
				);
		}
	};

	return (
		<div className="h-screen w-screen flex bg-gradient-to-br from-purple-50 to-orange-50">
			<div className="hidden md:block">
				<AppSidebar
					session={session}
					currentSection={currentSection}
					rooms={rooms}
					loadingRooms={loadingRooms}
					onSectionChange={setCurrentSection}
					setSelectedRoom={setSelectedRoom}
					onLogout={handleLogout}
				/>
			</div>

			<SidebarInset className="flex-1">
				<div className="flex flex-col min-h-screen">
					<header className="hidden md:flex h-14 shrink-0 items-center gap-2 border-b border-purple-200/50 bg-white/50 px-4">
						<SidebarTrigger className="-ml-1" />
					</header>

					<div className="flex-1 pb-16 md:pb-0">{renderCurrentSection()}</div>

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
