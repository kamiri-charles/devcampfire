import { TabsContent } from "../ui/tabs";
import { Star } from "lucide-react";

export function Trending() {
  return (
		<TabsContent value="trending" className="space-y-4">
			<div className="text-center py-8">
				<Star className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
				<h3>Trending Content</h3>
				<p className="text-muted-foreground">
					Discover the most popular developers and projects this week
				</p>
			</div>
		</TabsContent>
	);
}
