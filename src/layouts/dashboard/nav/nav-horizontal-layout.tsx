import { NavHorizontal } from "@/components/nav";
import type { NavProps } from "@/components/nav/types";
import { ScrollBar } from "@/ui/scroll-area";
import { ScrollArea } from "@/ui/scroll-area";

export function NavHorizontalLayout({ data }: NavProps) {
	return (
		<nav data-slot="olt-layout-nav" className={"w-full bg-background z-app-bar"}>
			<ScrollArea className="whitespace-nowrap px-2 bg-background">
				<NavHorizontal data={data} />
				<ScrollBar orientation="horizontal" />
			</ScrollArea>
		</nav>
	);
}
