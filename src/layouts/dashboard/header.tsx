import LocalePicker from "@/components/locale-picker";
import { useSettings } from "@/store/settingStore";
import { ThemeLayout } from "@/types/enum";
import { cn } from "@/utils";
import type { ReactNode } from "react";
import AccountDropdown from "../components/account-dropdown";
import BreadCrumb from "../components/bread-crumb";
import NoticeButton from "../components/notice";
import SearchBar from "../components/search-bar";
import SettingButton from "../components/setting-button";

interface HeaderProps {
	leftSlot?: ReactNode;
	navSlot?: ReactNode;
}

export default function Header({ leftSlot, navSlot }: HeaderProps) {
	const { breadCrumb, themeLayout } = useSettings();
	return (
		<header
			data-slot="olt-layout-header"
			className={cn(
				// "sticky top-0 left-0 right-0 z-app-bar",
				"flex items-center justify-between px-2 grow-0 shrink-0",
				"bg-background",
				"border-b border-dashed",
				"h-[var(--layout-header-height)] ",
			)}
		>
			<div className="flex items-center">
				{leftSlot}

				<div className="hidden md:block ml-4">
					{breadCrumb && themeLayout !== ThemeLayout.Horizontal && <BreadCrumb />}
				</div>
			</div>

			{/* navSlot */}
			{navSlot}

			<div className="flex items-center gap-1 shrink-0">
				<SearchBar />
				<LocalePicker />
				<NoticeButton />
				<SettingButton />
				<AccountDropdown />
			</div>
		</header>
	);
}
