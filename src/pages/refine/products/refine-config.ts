import type { IResourceItem } from "@refinedev/core";

export const productsRefineConfig: IResourceItem = {
	name: "products",
	list: "/refine/products",
	show: "/refine/products/:id",
	edit: "/refine/products/edit/:id",
	create: "/refine/products/create",
	meta: {
		dataProviderName: "refine",
	},
};
