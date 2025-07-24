import { $t } from "@/locales/i18n";
import { loader as editLoader } from "@/pages/example/curd/posts/edit-page";
import type { AppRouteObject } from "@/types/router";
import { lazy } from "react";

export const postsRoutes: AppRouteObject[] = [
	{
		path: "posts",
		Component: lazy(() => import("@/pages/example/curd/posts/list")),
		handle: { key: "posts", title: $t("文章列表-modal") },
	},
	{
		path: "pagePosts",
		Component: lazy(() => import("@/pages/example/curd/posts/list-page")),
		handle: { key: "postsPage", title: $t("文章列表-router") },
	},
	{
		// 动态路由
		path: "pagePosts/edit/:id",
		loader: editLoader,
		Component: lazy(() => import("@/pages/example/curd/posts/edit-page")),
		handle: { key: "postsEdit", title: $t("编辑文章"), hideMenu: true },
	},
	{
		path: "pagePosts/create",
		loader: editLoader,
		Component: lazy(() => import("@/pages/example/curd/posts/edit-page")),
		handle: { key: "postsCreate", title: $t("创建文章"), hideMenu: true },
	},
	{
		path: "pagePosts/detail/:id",
		Component: lazy(() => import("@/pages/example/curd/posts/detail-page")),
		handle: { key: "postsDetail", title: $t("文章详情"), hideMenu: true },
	},
	// 隐藏 tba 示例
	{
		path: "pagePosts/hiddenTabDetail/:id",
		Component: lazy(() => import("@/pages/example/curd/posts/detail-page")),
		handle: { key: "hiddenTabDetail", title: $t("隐藏 tab 示例"), hideMenu: true, hideTab: true },
	},
];
