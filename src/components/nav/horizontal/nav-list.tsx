import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/ui/hover-card";
import { useLocation } from "react-router";
import type { NavListProps } from "../types";
import { NavItem } from "./nav-item";

export function NavList({ data, depth = 0 }: NavListProps) {
	const hasChild = data.children && data.children.length > 0;
	const location = useLocation();
	const isActive = location.pathname.includes(data.path || "");

	if (data.meta?.hideMenu) {
		return null;
	}

	const renderNavItem = () => {
		return (
			<NavItem
				key={data.meta?.key}
				// data
				path={data.path}
				title={data.meta?.title as string}
				caption={data.meta?.caption}
				info={data.meta?.info}
				icon={data.meta?.icon}
				auth={data.meta?.auth}
				// state
				disabled={data.meta?.disabled}
				active={isActive}
				// options
				hasChild={hasChild}
				depth={depth}
			/>
		);
	};

	const renderRootItemWithHoverCard = () => {
		return (
			<HoverCard openDelay={100}>
				<HoverCardTrigger>{renderNavItem()}</HoverCardTrigger>
				<HoverCardContent side={depth === 1 ? "bottom" : "right"} sideOffset={10} className="p-1">
					{data.children?.map((child) => (
						<NavList key={child.meta?.key} data={child} depth={depth + 1} />
					))}
				</HoverCardContent>
			</HoverCard>
		);
	};

	return <li className="list-none">{hasChild ? renderRootItemWithHoverCard() : renderNavItem()}</li>;
}
