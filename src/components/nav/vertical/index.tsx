import { useSettings } from "@/store/settingStore";
import { cn } from "@/utils";
import type { NavProps } from "../types";
import { NavGroup } from "./nav-group";
import { NavList } from "./nav-list";

export function NavVertical({ data, className, ...props }: NavProps) {
	const settings = useSettings();
	const { group: groupSetting } = settings;
	return (
		<nav className={cn("flex w-full flex-col gap-1", className)} {...props}>
			{data?.map((group, index) =>
				group.handle?.groupKey && groupSetting ? (
					<NavGroup
						key={group.path || index}
						name={group.handle?.groupName}
						items={group.children?.filter((item) => !item.handle?.hideMenu) || []}
					/>
				) : (
					<ul key={group.path || index} className="flex w-full flex-col gap-1">
						<NavList key={group.path || index} data={group} depth={1} />
					</ul>
				),
			)}
		</nav>
	);
}
