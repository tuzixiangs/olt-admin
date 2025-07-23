import Logo from "@/components/logo";
import { GLOBAL_CONFIG } from "@/global-config";
import { down, useMediaQuery } from "@/hooks";
import { useSettings } from "@/store/settingStore";
import { ThemeLayout } from "#/enum";
import Header from "./header";
import Main from "./main";
import MultiTabs from "./multi-tabs";
import { NavHorizontalLayout, NavMobileLayout, NavVerticalLayout, useFilteredNavData } from "./nav";

export default function DashboardLayout() {
	const isMobile = useMediaQuery(down("md"));
	return (
		<div data-slot="olt-layout-root" className="w-full min-h-screen bg-background">
			{isMobile ? <MobileLayout /> : <PcLayout />}
		</div>
	);
}

function MobileLayout() {
	const navData = useFilteredNavData();
	return (
		<>
			{/* Sticky Header */}
			<div id="olt-layout-header-wrapper">
				<Header leftSlot={<NavMobileLayout data={navData} />} />
			</div>
			<Main />
		</>
	);
}

function PcLayout() {
	const { themeLayout } = useSettings();

	if (themeLayout === ThemeLayout.Horizontal) return <PcHorizontalLayout />;
	return <PcVerticalLayout />;
}

function PcHorizontalLayout() {
	const navData = useFilteredNavData();
	const settings = useSettings();
	const { multiTab } = settings;
	return (
		<>
			{/* Sticky Header */}
			<div className="sticky top-0 left-0 right-0 z-app-bar" id="olt-layout-header-wrapper">
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

			<Main />
		</>
	);
}

function PcVerticalLayout() {
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
				<div className="sticky top-0 left-0 right-0 z-app-bar" id="olt-layout-header-wrapper">
					<Header />
					{/* Multi Tabs */}
					{multiTab ? <MultiTabs /> : null}
				</div>
				<Main />
			</div>
		</>
	);
}
