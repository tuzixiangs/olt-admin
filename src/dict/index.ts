import type { GroupKey } from "@/types/router";
import { t } from "@/utils/i18n";

export const GroupInfo: Record<GroupKey, { title: string; order: number }> = {
	ui: {
		title: t("sys.nav.ui"),
		order: 0,
	},
	pages: {
		title: t("sys.nav.pages"),
		order: 1,
	},
};
