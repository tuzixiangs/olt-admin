import type { AppRouteObject, RouteMeta } from "@/types/router";

export type NavItemOptionsProps = {
	depth?: number;
	hasChild?: boolean;
};

export type NavItemStateProps = {
	open?: boolean;
	active?: boolean;
	disabled?: boolean;
	hidden?: boolean;
};

export type NavItemDataProps = {
	path?: string;
} & Omit<RouteMeta, "key">;

/**
 * Item
 */
export type NavItemProps = React.ComponentProps<"div"> & NavItemDataProps & NavItemOptionsProps;

/**
 * List
 */
export type NavListProps = Pick<NavItemProps, "depth"> & {
	data: AppRouteObject;
	authenticate?: (auth?: NavItemProps["auth"]) => boolean;
};

/**
 * Group
 */
export type NavGroupProps = Omit<NavListProps, "data" | "depth"> & {
	name?: string | React.ReactNode | (() => string | React.ReactNode);
	items: AppRouteObject[];
};

/**
 * Main
 */
export type NavProps = React.ComponentProps<"nav"> &
	Omit<NavListProps, "data" | "depth"> & {
		data: AppRouteObject[];
	};
