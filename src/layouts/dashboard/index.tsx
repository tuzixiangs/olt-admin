import Logo from "@/components/logo";
import { GLOBAL_CONFIG } from "@/global-config";
import { down, useMediaQuery } from "@/hooks";
import { useSettings } from "@/store/settingStore";
import type { ReactNode } from "react";
import { ThemeLayout } from "#/enum";
import Header from "./header";
import Main from "./main";
import MultiTabs from "./multi-tabs";
import { NavHorizontalLayout, NavMobileLayout, NavVerticalLayout, useFilteredNavData } from "./nav";

interface DashboardLayoutProps {
	children?: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
	const isMobile = useMediaQuery(down("md"));
	return (
		<div data-slot="olt-layout-root" className="w-full min-h-screen bg-background">
			{isMobile ? <MobileLayout>{children}</MobileLayout> : <PcLayout>{children}</PcLayout>}
		</div>
	);
}

function MobileLayout({ children }: { children?: ReactNode }) {
	const navData = useFilteredNavData();
	return (
		<>
			{/* Sticky Header */}
			<Header leftSlot={<NavMobileLayout data={navData} />} />
			<Main>{children}</Main>
		</>
	);
}

function PcLayout({ children }: { children?: ReactNode }) {
	const { themeLayout } = useSettings();

	if (themeLayout === ThemeLayout.Horizontal) return <PcHorizontalLayout>{children}</PcHorizontalLayout>;
	return <PcVerticalLayout>{children}</PcVerticalLayout>;
}

function PcHorizontalLayout({ children }: { children?: ReactNode }) {
	const navData = useFilteredNavData();
	const settings = useSettings();
	const { multiTab } = settings;
	return (
		<>
			{/* Sticky Header */}
			<div className="sticky top-0 left-0 right-0 z-app-bar">
				<Header
					leftSlot={
						<div className="flex items-center">
							<Logo />
							<div className="shrink-0 text-xl font-bold transition-all duration-300 ease-in-out ml-2 mr-4">
								{GLOBAL_CONFIG.appName}
							</div>
						</div>
					}
					navSlot={<NavHorizontalLayout data={navData} />}
				/>
				{/* Multi Tabs */}
				{multiTab ? <MultiTabs /> : null}
			</div>

			<Main>{children}</Main>
		</>
	);
}

function PcVerticalLayout({ children }: { children?: ReactNode }) {
	const settings = useSettings();
	const { themeLayout, multiTab } = settings;
	const navData = useFilteredNavData();

	const mainPaddingLeft =
		themeLayout === ThemeLayout.Vertical ? "var(--layout-nav-width)" : "var(--layout-nav-width-mini)";

	return (
		<>
			{/* Fixed Header */}
			<NavVerticalLayout data={navData} />

			<div
				className="relative w-full min-h-screen flex flex-col transition-[padding] duration-300 ease-in-out"
				style={{
					paddingLeft: mainPaddingLeft,
				}}
			>
				<div className="sticky top-0 left-0 right-0 z-app-bar">
					<Header />
					{/* Multi Tabs */}
					{multiTab ? <MultiTabs /> : null}
				</div>
				<Main>{children}</Main>
			</div>
		</>
	);
}
