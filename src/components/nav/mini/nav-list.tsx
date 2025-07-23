import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/ui/hover-card";
import { useLocation } from "react-router";
import type { NavListProps } from "../types";
import { NavRootItem } from "./nav-root-item";
import { NavSubItem } from "./nav-sub-item";

export function NavList({ data, depth = 0 }: NavListProps) {
	const children = data.children?.filter((item) => !item.handle?.hideMenu) || [];
	const hasChild = children && children.length > 0;
	const location = useLocation();
	const isActive = location.pathname.includes(data.path || "");

	if (data.handle?.hideMenu) {
		return null;
	}

	const renderRootNavItem = () => {
		return (
			<NavRootItem
				key={data.handle?.key}
				// data
				path={data.path}
				title={data.handle?.title as string}
				caption={data.handle?.caption}
				info={data.handle?.info}
				icon={data.handle?.icon}
				auth={data.handle?.auth}
				// state
				disabled={data.handle?.disabled}
				active={isActive}
				// options
				hasChild={hasChild}
				depth={depth}
			/>
		);
	};

	const renderSubNavItem = () => {
		return (
			<NavSubItem
				key={data.handle?.key}
				// data
				path={data.path}
				title={data.handle?.title as string}
				caption={data.handle?.caption}
				info={data.handle?.info}
				icon={data.handle?.icon}
				auth={data.handle?.auth}
				// state
				disabled={data.handle?.disabled}
				active={isActive}
				// options
				hasChild={hasChild}
				depth={depth}
			/>
		);
	};

	const renderNavItem = () => (depth === 1 ? renderRootNavItem() : renderSubNavItem());

	const renderRootItemWithHoverCard = () => {
		return (
			<HoverCard openDelay={100}>
				<HoverCardTrigger>{renderNavItem()}</HoverCardTrigger>
				<HoverCardContent side="right" sideOffset={10} className="p-1">
					{children.map((child) => (
						<NavList key={child.path} data={child} depth={depth + 1} />
					))}
				</HoverCardContent>
			</HoverCard>
		);
	};

	return <li className="list-none">{hasChild ? renderRootItemWithHoverCard() : renderNavItem()}</li>;
}
