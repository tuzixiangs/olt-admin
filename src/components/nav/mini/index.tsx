import { useSettings } from "@/store/settingStore";
import { cn } from "@/utils";
import type { NavProps } from "../types";
import { NavGroup } from "./nav-group";
import { NavList } from "./nav-list";

export const NavMini = ({ data, className, ...props }: NavProps) => {
	const settings = useSettings();
	const { group: groupSetting } = settings;
	return (
		<nav className={cn("flex flex-col", className)} {...props}>
			<ul className="flex flex-col gap-1">
				{data.map((item, index) =>
					item.meta?.groupKey && groupSetting ? (
						<NavGroup key={item.path || index} items={item.children || []} />
					) : (
						<ul key={item.path || index} className="flex w-full flex-col gap-1">
							<NavList key={item.path || index} data={item} depth={1} />
						</ul>
					),
				)}
			</ul>
		</nav>
	);
};
