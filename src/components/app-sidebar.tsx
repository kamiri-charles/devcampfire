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
  useSidebar,
} from "./ui/sidebar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { 
  Home,
  User, 
  Users, 
  Search, 
  Settings,
  Hash,
  LogOut,
  Send,
  ChevronUp,
  Heart
} from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretLeft, faFire, faCaretRight, faUser } from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { Session } from "next-auth";
import Link from "next/link";

interface AppSidebarProps {
	session: Session | null;
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

export default function AppSidebar({ session, currentSection, onSectionChange, onLogout }: AppSidebarProps) {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

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
									className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer"
								>
									<Avatar className="h-8 w-8 rounded-lg">
										<AvatarImage
											src={session?.user.image || "/favicon.ico"}
											alt={session?.user.username || "User Avatar"}
										/>
										<AvatarFallback className="rounded-lg bg-gradient-to-br from-purple-400 to-purple-600">
											<FontAwesomeIcon icon={faUser} />
										</AvatarFallback>
									</Avatar>
									<div className="grid flex-1 text-left text-sm leading-tight">
										<span className="truncate font-semibold">
											{session?.user.name || "developer"}
										</span>
										<span className="truncate text-xs text-muted-foreground">
											@{session?.user.username || "username"}
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
								<DropdownMenuItem onClick={() => onSectionChange("profile")} className="cursor-pointer">
									<User className="size-4 mr-2" />
									Profile
								</DropdownMenuItem>
								<DropdownMenuItem className="cursor-pointer">
									<Settings className="size-4 mr-2" />
									Settings
								</DropdownMenuItem>
								<DropdownMenuItem>
									<Link
										href={`https://github.com/${session?.user.username}`}
										target="_blank"
										rel="noopener noreferrer"
									>
										<FontAwesomeIcon icon={faGithub} className="size-4 mr-2" />
										GitHub Profile
									</Link>
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