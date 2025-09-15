"use client";

import { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { DBConversation } from "@/db/schema";
import { GitHubConnections, RepoType } from "@/types/github";
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

export default function UserPage() {
	const [currentSection, setCurrentSection] = useState("dashboard");
	const [currentDMId, setCurrentDMId] = useState<string | null>(null);
	const [languages, setLanguages] = useState<string[]>([]);
	const [loadingLanguages, setLoadingLanguages] = useState(true);
	const [repos, setRepos] = useState<RepoType[]>([]);
	const [loadingRepos, setLoadingRepos] = useState(true);
	const [channels, setChannels] = useState<DBConversation[]>([]);
	const [loadingChannels, setLoadingChannels] = useState(true);
	const [selectedRoom, setSelectedRoom] = useState<DBConversation | null>(null);
	const [githubConnections, setGitHubConnections] = useState<GitHubConnections | null>(null);
	const [loadingConnections, setLoadingConnections] = useState(true);	
	const { data: session, status } = useSession();

	useEffect(() => {
		if (status === "unauthenticated") redirect("/welcome");

		const updateStatus = async () => {
			try {
				await fetch("/api/db/users/status", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ status: "online" }),
				});
			} catch (e) {
				console.error(e);
			}
		};
		updateStatus();

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
					setChannels(data);
				}
			} catch (e) {
				console.error(e);
			} finally {
				setLoadingChannels(false);
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


		// Before unload, set status to offline
		const handleBeforeUnload = async () => {
			try {
				await fetch("/api/db/users/status", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ status: "offline" }),
				});
			} catch (e) {
				console.error(e);
			}
		};
		
		window.addEventListener("beforeunload", handleBeforeUnload);

	}, [status, session?.user.dbId]);

	const handleLogout = () => {
		setCurrentSection("dashboard");
		setCurrentDMId(null);
		setCurrentDMId(null);
		signOut({ redirectTo: "/welcome" });
	};

	const handleOpenDM = (dmId: string) => {
		setCurrentDMId(dmId);
		setCurrentSection("dms");
	};

	const handleBackFromMessages = () => {
		setCurrentDMId(null);
		setCurrentSection("dashboard");
	};

	const renderCurrentSection = () => {
		switch (currentSection) {
			case "dashboard":
				return (
					<Dashboard
						session={session}
						repoCount={repos.length}
						connections={
							githubConnections
								? githubConnections.followers.length +
								  githubConnections.following.length
								: 0
						}
						onSectionChange={setCurrentSection}
						onStartPrivateChat={handleOpenDM}
						setSelectedRoom={setSelectedRoom}
					/>
				);
			case "room":
				return <RoomMessages selectedRoom={selectedRoom} />;
			case "dms":
				return (
					<DirectMessages
						chatId={currentDMId}
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
						setChatId={setCurrentDMId}
					/>
				);
			default:
				return (
					<Dashboard
						session={session}
						repoCount={repos.length}
						connections={githubConnections ? (githubConnections.followers.length + githubConnections.following.length) : 0}
						onSectionChange={setCurrentSection}
						onStartPrivateChat={handleOpenDM}
						setSelectedRoom={setSelectedRoom}
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
					rooms={channels}
					loadingRooms={loadingChannels}
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
