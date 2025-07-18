import { useSettings } from "@/store/settingStore";
import { cn } from "@/utils";
import type { NavProps } from "../types";
import { NavGroup } from "./nav-group";
import { NavList } from "./nav-list";

export function NavHorizontal({ data, className, ...props }: NavProps) {
	const settings = useSettings();
	const { group: groupSetting } = settings;
	return (
		<nav className={cn("flex items-center gap-1 min-h-[var(--layout-nav-height-horizontal)]", className)} {...props}>
			{data.map((group, index) =>
				group.meta?.groupKey && groupSetting ? (
					<NavGroup key={group.path || index} name={group.meta?.groupName} items={group.children || []} />
				) : (
					<ul key={group.path || index} className="flex flex-row gap-1">
						<NavList key={group.path || index} data={group} depth={1} />
					</ul>
				),
			)}
		</nav>
	);
}
