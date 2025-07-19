import { useSettings } from "@/store/settingStore";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/ui/collapsible";
import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import type { NavListProps } from "../types";
import { NavItem } from "./nav-item";

export function NavList({ data, depth = 1 }: NavListProps) {
	const location = useLocation();
	const isActive = location.pathname.includes(data.path || "");
	const [open, setOpen] = useState(isActive);
	const children = data.children?.filter((item) => !item.meta?.hideMenu) || [];
	const hasChild = children && children.length > 0;
	const { accordion: accordionSetting } = useSettings();

	const handleClick = () => {
		if (hasChild) {
			setOpen(!open);
		}
	};

	useEffect(() => {
		if (accordionSetting) {
			setOpen(isActive);
		}
	}, [accordionSetting, isActive]);

	if (data.meta?.hideMenu) {
		return null;
	}

	return (
		<Collapsible open={open} onOpenChange={setOpen} data-nav-type="list">
			<CollapsibleTrigger className="w-full">
				<NavItem
					// data
					title={data.meta?.title as string}
					path={data.path || ""}
					icon={data.meta?.icon}
					info={data.meta?.info}
					caption={data.meta?.caption}
					auth={data.meta?.auth}
					// state
					open={open}
					active={isActive}
					disabled={data.meta?.disabled}
					// options
					hasChild={hasChild}
					depth={depth}
					// event
					onClick={handleClick}
				/>
			</CollapsibleTrigger>
			{hasChild && (
				<CollapsibleContent>
					<div className="ml-4 mt-1 flex flex-col gap-1">
						{children.map((child) => (
							<NavList key={child.meta?.key} data={child} depth={depth + 1} />
						))}
					</div>
				</CollapsibleContent>
			)}
		</Collapsible>
	);
}
