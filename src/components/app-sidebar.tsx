import { useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "./ui/sidebar";
import { 
  Home,
  MessageCircle, 
  User, 
  Users, 
  Search, 
  Settings,
  Hash,
  Github,
  LogOut,
  Send,
  Sparkles,
  ChevronUp,
  Plus,
  Heart
} from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretLeft, faFire, faCaretRight } from "@fortawesome/free-solid-svg-icons";

interface AppSidebarProps {
  user: any;
  currentSection: string;
  onSectionChange: (section: string) => void;
  onLogout: () => void;
}

const channels = [
  { id: "general", name: "general", description: "General discussion" },
  { id: "javascript", name: "javascript", description: "JavaScript discussions" },
  { id: "react", name: "react", description: "React help and tips" },
  { id: "python", name: "python", description: "Python programming" },
  { id: "help", name: "help", description: "Get help from the community" }
];

const mainNavItems = [
  {
    id: "dashboard",
    title: "Dashboard",
    icon: Home,
    isActive: false
  },
  {
    id: "messages",
    title: "Direct Messages",
    icon: Send,
    isActive: false
  },
  {
    id: "friends",
    title: "Friends",
    icon: Heart,
    isActive: false
  },
  {
    id: "profile",
    title: "My Profile",
    icon: User,
    isActive: false
  },
  {
    id: "collaboration",
    title: "Collaboration",
    icon: Users,
    isActive: false
  },
  {
    id: "discovery",
    title: "Discovery",
    icon: Search,
    isActive: false
  }
];

export default function AppSidebar({ user, currentSection, onSectionChange, onLogout }: AppSidebarProps) {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  if (!user) return null;

  return (
		<Sidebar collapsible="icon" className="border-r border-purple-200/50">
			<SidebarHeader className="border-b border-purple-200/50 bg-gradient-to-r from-purple-50 to-orange-50">
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton
							size="lg"
							className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
						>
							<div className="mx-auto w-8 h-16 rounded-2xl flex items-center justify-center">
								<FontAwesomeIcon
									icon={faCaretLeft}
									size={isCollapsed ? "1x" : "lg"}
									className="text-purple-600"
								/>
								<FontAwesomeIcon
									icon={faFire}
									size={isCollapsed ? "1x" : "lg"}
									className="text-orange-500"
								/>
								<FontAwesomeIcon
									icon={faCaretRight}
									size={isCollapsed ? "1x" : "lg"}
									className="text-purple-600"
								/>
							</div>
							<div className="grid flex-1 text-left text-sm leading-tight">
								<span className="truncate font-semibold">DevCampfire</span>
								<span className="truncate text-xs text-muted-foreground">
									Developer Community
								</span>
							</div>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>

			<SidebarContent>
				{/* Main Navigation */}
				<SidebarGroup>
					<SidebarGroupLabel>Navigation</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{mainNavItems.map((item) => (
								<SidebarMenuItem key={item.id}>
									<SidebarMenuButton
										tooltip={item.title}
										onClick={() => onSectionChange(item.id)}
										isActive={currentSection === item.id}
										className="data-[active=true]:bg-gradient-to-r data-[active=true]:from-purple-500 data-[active=true]:to-purple-600 data-[active=true]:text-white cursor-pointer"
									>
										<item.icon className="size-4" />
										<span>{item.title}</span>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>

				{/* Channels */}
				<SidebarGroup>
					<SidebarGroupLabel>Channels</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{channels.map((channel) => (
								<SidebarMenuItem key={channel.id}>
									<SidebarMenuButton
										tooltip={`#${channel.name}`}
										onClick={() => onSectionChange("chat")}
										className="text-muted-foreground hover:text-foreground hover:bg-purple-50 cursor-pointer"
									>
										<Hash className="size-4" />
										<span>{channel.name}</span>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>

			<SidebarFooter className="border-t border-purple-200/50">
				<SidebarMenu>
					<SidebarMenuItem>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<SidebarMenuButton
									size="lg"
									className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
								>
									<Avatar className="h-8 w-8 rounded-lg">
										<AvatarImage src={user.avatar_url} alt={user.name} />
										<AvatarFallback className="rounded-lg bg-gradient-to-br from-purple-400 to-purple-600 text-white">
											{user.name[0]}
										</AvatarFallback>
									</Avatar>
									<div className="grid flex-1 text-left text-sm leading-tight">
										<span className="truncate font-semibold">{user.name}</span>
										<span className="truncate text-xs text-muted-foreground">
											@{user.login}
										</span>
									</div>
									<ChevronUp className="ml-auto size-4" />
								</SidebarMenuButton>
							</DropdownMenuTrigger>
							<DropdownMenuContent
								className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
								side="bottom"
								align="end"
								sideOffset={4}
							>
								<DropdownMenuItem onClick={() => onSectionChange("profile")}>
									<User className="size-4 mr-2" />
									Profile
								</DropdownMenuItem>
								<DropdownMenuItem>
									<Settings className="size-4 mr-2" />
									Settings
								</DropdownMenuItem>
								<DropdownMenuItem>
									<Github className="size-4 mr-2" />
									GitHub Profile
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem onClick={onLogout} className="text-red-600">
									<LogOut className="size-4 mr-2" />
									Sign out
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter>
		</Sidebar>
	);
}