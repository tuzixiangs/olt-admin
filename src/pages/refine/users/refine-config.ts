import type { IResourceItem } from "@refinedev/core";

export const usersRefineConfig: IResourceItem = {
	name: "users",
	list: "/refine/users",
	create: "/refine/users/create",
	edit: "/refine/users/edit/:id",
	show: "/refine/users/show/:id",
	meta: {
		dataProviderName: "refine",
	},
};
