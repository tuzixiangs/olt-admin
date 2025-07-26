import Color from "color";
import { commonColors, paletteColors } from "./color";

export const lightShadowTokens = {
	none: "none",
	sm: `0 1px 2px 0 ${Color(paletteColors.gray[500]).alpha(0.16)}`,
	// default: `0 4px 8px 0 ${Color(paletteColors.gray[500]).alpha(0.16)}`,
	// md: `0 8px 16px 0 ${Color(paletteColors.gray[500]).alpha(0.16)}`,
	// lg: `0 12px 24px 0 ${Color(paletteColors.gray[500]).alpha(0.16)}`,
	default: "0px 1px 10px rgba(14, 16, 23, 6%), 0 2px 4px -1px rgba(14, 16, 23, 8%)", //对应 ui 规范中的基础阴影
	md: "0 3px 14px 2px rgba(14, 16, 23, 3%), 0 8px 10px 1px rgba(14, 16, 23, 6%), 0 5px 5px -3px rgba(14, 16, 23, 8%)", //对应 ui 规范中的中等阴影
	lg: "0 6px 30px 5px rgba(14, 16, 23, 4%), 0 16px 24px 2px rgba(14, 16, 23, 4%), 0 8px 10px -5px rgba(14, 16, 23, 6%)", //对应 ui 规范中的上层阴影
	xl: `0 16px 32px 0 ${Color(paletteColors.gray[500]).alpha(0.16)}`,
	"2xl": `0 20px 40px 0 ${Color(paletteColors.gray[500]).alpha(0.16)}`,
	"3xl": `0 24px 48px 0 ${Color(paletteColors.gray[500]).alpha(0.16)}`,
	inner: `inset 0 2px 4px 0 ${Color(paletteColors.gray[500]).alpha(0.16)}`,

	dialog: `-40px 40px 80px -8px ${Color(commonColors.black).alpha(0.24)}`,
	card: `0 0 2px 0 ${Color(paletteColors.gray[500]).alpha(0.2)}, 0 12px 24px -4px ${Color(paletteColors.gray[500]).alpha(0.12)}`,
	dropdown: `0 0 2px 0 ${Color(paletteColors.gray[500]).alpha(0.24)}, -20px 20px 40px -4px ${Color(paletteColors.gray[500]).alpha(0.24)}`,
	input: `0 0 0 2px ${Color(paletteColors.link.light2).alpha(0.6)}`,

	primary: `0 8px 16px 0 ${Color(paletteColors.primary.default).alpha(0.24)}`,
	info: `0 8px 16px 0 ${Color(paletteColors.info.default).alpha(0.24)}`,
	success: `0 8px 16px 0 ${Color(paletteColors.success.default).alpha(0.24)}`,
	warning: `0 8px 16px 0 ${Color(paletteColors.warning.default).alpha(0.24)}`,
	error: `0 8px 16px 0 ${Color(paletteColors.error.default).alpha(0.24)}`,
};

export const darkShadowTokens = {
	none: "none",
	sm: `0 1px 2px 0 ${Color(commonColors.black).alpha(0.16)}`,
	default: `0 4px 8px 0 ${Color(commonColors.black).alpha(0.16)}`,
	md: `0 8px 16px 0 ${Color(commonColors.black).alpha(0.16)}`,
	lg: `0 12px 24px 0 ${Color(commonColors.black).alpha(0.16)}`,
	xl: `0 16px 32px 0 ${Color(commonColors.black).alpha(0.16)}`,
	"2xl": `0 20px 40px 0 ${Color(commonColors.black).alpha(0.16)}`,
	"3xl": `0 24px 48px 0 ${Color(commonColors.black).alpha(0.16)}`,
	inner: `inset 0 2px 4px 0 ${Color(commonColors.black).alpha(0.16)}`,

	dialog: `-40px 40px 80px -8px ${Color(commonColors.black).alpha(0.24)}`,
	card: `0 0 2px 0 ${Color(commonColors.black).alpha(0.2)}, 0 12px 24px -4px ${Color(commonColors.black).alpha(0.12)}`,
	dropdown: `0 0 2px 0 ${Color(commonColors.black).alpha(0.24)}, -20px 20px 40px -4px ${Color(commonColors.black).alpha(0.24)}`,
	input: `0 0 0 2px ${Color(paletteColors.link.light2).alpha(0.6)}`,

	primary: `0 8px 16px 0 ${Color(paletteColors.primary.default).alpha(0.24)}`,
	info: `0 8px 16px 0 ${Color(paletteColors.info.default).alpha(0.24)}`,
	success: `0 8px 16px 0 ${Color(paletteColors.success.default).alpha(0.24)}`,
	warning: `0 8px 16px 0 ${Color(paletteColors.warning.default).alpha(0.24)}`,
	error: `0 8px 16px 0 ${Color(paletteColors.error.default).alpha(0.24)}`,
};
