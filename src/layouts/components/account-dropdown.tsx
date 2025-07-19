import { useLoginStateContext } from "@/pages/sys/login/providers/login-provider";
import { useRouter } from "@/routes/hooks";
import { useUserActions, useUserInfo } from "@/store/userStore";
import { Button } from "@/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/ui/dropdown-menu";
import { useTranslation } from "react-i18next";

/**
 * Account Dropdown
 */
export default function AccountDropdown() {
	const { replace } = useRouter();
	const { username, email, avatar } = useUserInfo();
	const { clearUserInfoAndToken } = useUserActions();
	const { backToLogin } = useLoginStateContext();
	const { t } = useTranslation();
	const logout = () => {
		try {
			clearUserInfoAndToken();
			backToLogin();
		} catch (error) {
			console.log(error);
		} finally {
			replace("/auth/login");
		}
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" size="icon" className="rounded-full">
					<img className="h-6 w-6 rounded-full" src={avatar} alt="" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-56">
				<div className="flex items-center gap-2 p-2">
					<img className="h-10 w-10 rounded-full" src={avatar} alt="" />
					<div className="flex flex-col items-start">
						<div className="text-text-primary text-sm font-medium">{username}</div>
						<div className="text-text-secondary text-xs">{email}</div>
					</div>
				</div>
				<DropdownMenuSeparator />
				<DropdownMenuItem asChild>
					<a href="https://docs-admin.oltspaces.com/" target="_blank" rel="noopener noreferrer">
						{t("sys.docs")}
					</a>
				</DropdownMenuItem>
				<DropdownMenuItem>
					<span className="text-text-tertiary">{t("sys.nav.user.profile")} (TODO)</span>
				</DropdownMenuItem>
				<DropdownMenuItem>
					<span className="text-text-tertiary">{t("sys.nav.user.account")} (TODO)</span>
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem className="font-bold text-warning" onClick={logout}>
					{t("sys.login.logout")}
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
