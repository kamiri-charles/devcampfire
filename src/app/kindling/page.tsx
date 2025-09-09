"use client"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretLeft, faFire, faCaretRight } from "@fortawesome/free-solid-svg-icons";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";


function Kindling() {
    const {data: session, status} = useSession();
    const router = useRouter();

    useEffect(() => {
			if (status === "authenticated" && session?.user?.name) {
				//router.push(`/camp/${session.user.name}`);
                console.log(session);
			}
		}, [session, status, router]);
    
  return (
		<div className="min-h-screen w-full bg-gradient-to-br from-purple-600 via-purple-700 to-orange-600 flex items-center justify-center p-4">
			<Card className="w-full max-w-md backdrop-blur-sm bg-white/95 border-0 shadow-2xl">
				<CardHeader className="text-center space-y-2 pb-8">
					<div>
						<CardTitle className="text-2xl bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent mb-2">
							DevCampfire
						</CardTitle>
					</div>
				</CardHeader>
				<CardContent className="space-y-4 flex flex-col items-center">
					<div className="mx-auto w-28 h-16 rounded-2xl flex items-center justify-center">
						<FontAwesomeIcon
							icon={faCaretLeft}
							size="3x"
							className="text-purple-600"
						/>
						<FontAwesomeIcon
							icon={faFire}
							size="3x"
							className="text-orange-500 fa-beat-fade"
						/>
						<FontAwesomeIcon
							icon={faCaretRight}
							size="3x"
							className="text-purple-600"
						/>
					</div>
					<span className="text-2xl text-purple-600 mb-2">
						Loading
					</span>
				</CardContent>
			</Card>
		</div>
	);
}

export default Kindling