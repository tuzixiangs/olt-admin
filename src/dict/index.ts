import { $t } from "@/locales/i18n";
import type { GroupKey } from "@/types/router";

export const GroupInfo: Record<GroupKey, { title: string; order: number }> = {
	ui: {
		title: $t("sys.nav.ui"),
		order: 1,
	},
	pages: {
		title: $t("sys.nav.pages"),
		order: 0,
	},
};
