import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
	// OLT Admin 文档侧边栏
	tutorialSidebar: [
		"intro",
		{
			type: "category",
			label: "快速开始",
			items: ["getting-started/installation", "getting-started/quick-start", "getting-started/project-structure"],
		},
		{
			type: "category",
			label: "架构设计",
			items: ["architecture/feature-sliced-design", "architecture/tech-stack"],
		},
		{
			type: "category",
			label: "开发指南",
			items: [
				"development/code-style",
				"development/internationalization",
				"development/routing",
				"development/state-management",
				"development/state-management-comparison",
				"development/tanstack-query",
				"development/store",
				"development/http",
				"development/theme",
				"development/curd",
				"development/page-caching-state-management",
			],
		},
		{
			type: "category",
			label: "工具",
			items: ["tools/react-scan"],
		},
		{
			type: "category",
			label: "组件库",
			items: [
				"components/index",
				"components/animate",
				"components/auth",
				"components/enhanced-keep-alive",
				"components/icon",
				"components/loading",
				"components/olt-modal",
				"components/olt-table",
				"components/olt-toast",
				"components/olt-upload",
			],
		},
		{
			type: "category",
			label: "Hooks",
			items: [
				"hooks/index",
				"hooks/use-copy-to-clipboard",
				"hooks/use-keep-alive-manager",
				"hooks/use-media-query",
				"hooks/use-page-state",
				"hooks/use-pro-table",
			],
		},
		// {
		// 	type: "category",
		// 	label: "API 参考",
		// 	items: ["api/index"],
		// },
		// {
		// 	type: "category",
		// 	label: "部署",
		// 	items: ["deployment/index"],
		// },
	],
};

export default sidebars;
