import { Button } from "./ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "./ui/card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { faAngleLeft, faAngleRight, faCaretLeft, faCaretRight, faChartLine, faFire, faUsers } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";



export default function GetStarted() {

	const router = useRouter();

	return (
		<div className="min-h-screen w-full bg-gradient-to-br from-purple-600 via-purple-700 to-orange-600 flex items-center justify-center p-4">
			<div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>

			<Card className="w-full max-w-md backdrop-blur-sm bg-white/95 border-0 shadow-2xl">
				<CardHeader className="text-center space-y-2 pb-8">
					<div className="mx-auto w-18 h-16 rounded-2xl flex items-center justify-center">
						<FontAwesomeIcon
							icon={faCaretLeft}
							size="2x"
							className="text-purple-600"
						/>
						<FontAwesomeIcon
							icon={faFire}
							size="2x"
							className="text-orange-500"
						/>
						<FontAwesomeIcon
							icon={faCaretRight}
							size="2x"
							className="text-purple-600"
						/>
					</div>
					<div>
						<CardTitle className="text-2xl bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent mb-2">
							Welcome to DevCampfire
						</CardTitle>
						<CardDescription className="text-base">
							Join the community where developers connect, collaborate, and grow
							together
						</CardDescription>
					</div>
				</CardHeader>
				<CardContent className="space-y-4">
					<Button
						onClick={() => router.push("/kamiri-charles")}
						className="w-full h-12 cursor-pointer bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-lg hover:shadow-xl transition-all duration-200"
						size="lg"
					>
						<FontAwesomeIcon icon={faGithub} size="lg" className="mr-3" />
						Continue with GitHub
					</Button>
					<p className="text-sm text-muted-foreground text-center">
						Your profile will auto-import your repositories and languages
					</p>

					<div className="pt-4 text-center">
						<div className="grid grid-cols-3 gap-4 text-xs text-muted-foreground">
							<div className="flex flex-col items-center space-y-1">
								<div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center">
									<FontAwesomeIcon
										icon={faGithub}
										className="text-white"
										size="2x"
									/>
								</div>
								<span>Connect</span>
							</div>
							<div className="flex flex-col items-center space-y-1">
								<div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-lg flex items-center justify-center">
									<FontAwesomeIcon
										icon={faUsers}
										className="text-white"
										size="2x"
									/>
								</div>
								<span>Collaborate</span>
							</div>
							<div className="flex flex-col items-center space-y-1">
								<div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center">
									<FontAwesomeIcon
										icon={faChartLine}
										className="text-white"
										size="2x"
									/>
								</div>
								<span>Grow</span>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
