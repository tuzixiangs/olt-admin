import { rgbAlpha } from "@/utils/theme";
import { ThemeColorPresets } from "#/enum";

export const presetsColors = {
	[ThemeColorPresets.Default]: {
		// 系统中的主色（优先使用）
		lighter: "#E6F3FA",
		light: "#E6F3FA",
		default: "#09588D",
		dark: "#06396D",
		darker: "#031F40",

		// ui规范中的全部主色 分为语意化和非语意化，所有变量都将遵循这个规则（优先使用系统中的通用变量规则）
		// （为什么这么做？主要为了能获取到所有到颜色变量， 并提供语意化的快捷版本）
		brand1: "#E6F3FA",
		brand2: "#C8E8FA",
		brand3: "#A8D4ED",
		brand4: "#7EBCE0",
		brand5: "#5EA4CC",
		brand6: "#438FBB",
		brand7: "#2672A4",
		brand8: "#09588D", // default
		brand9: "#074670",
		brand10: "#0A3552",

		// 语意化的其他变量
		focus: "#C8E8FA", // light
		disabled: "#A8D4ED", // brand3
		hover: "#2672A4", // brand7
		normal: "#09588D", // default
		click: "#074670", // brand9
	},
};

/**
 * We recommend picking colors with these values for [Eva Color Design](https://colors.eva.design/):
 *  + lighter : 100
 *  + light : 300
 *  + main : 500
 *  + dark : 700
 *  + darker : 900
 */
export const paletteColors = {
	primary: presetsColors[ThemeColorPresets.Default],
	success: {
		lighter: "#EBFAF0",
		light: "#EBFAF0",
		light2: "#BAF5D0",
		default: "#2BAB5E",
		dark: "#2E7D32",
		darker: "#1B5E20",

		// 同 presetsColors
		success1: "#EBFAF0",
		success2: "#BAF5D0", //focus
		success3: "#8DEBAF", //disabled
		success4: "#4FD183", //hover
		success5: "#2BAB5E", // normal
		success6: "#178F47", //click
		success7: "#15753B",
		success8: "#0E572A",
		success9: "#05421D",
		success10: "#053317",

		focus: "#BAF5D0", // light
		disabled: "#8DEBAF", // success3
		hover: "#4FD183", // success4
		normal: "#2BAB5E", // success5
		click: "#178F47", // success6
	},
	warning: {
		lighter: "#FFF4EB",
		light: "#FFF4EB",
		light2: "#FCE1C5",
		default: "#E87523",
		dark: "#F57C00",
		darker: "#E65100",

		warning1: "#FFF4EB",
		warning2: "#FCE1C5", //focus
		warning3: "#F7C694", //disabled
		warning4: "#F29A5E", //hover
		warning5: "#E87523", //normal
		warning6: "#CC5A21", //click
		warning7: "#B83F0B",
		warning8: "#993206",
		warning9: "#802C08",
		warning10: "#591A07",

		focus: "#FCE1C5", // light
		disabled: "#F7C694", // warning3
		hover: "#F29A5E", // warning4
		normal: "#E87523", // warning5
		click: "#CC5A21", // warning6
	},
	error: {
		lighter: "#FCEEED",
		light: "#FCEEED",
		light2: "#FCD0CF",
		default: "#E64E45",
		dark: "#D32F2F",
		darker: "#B71C1C",

		error1: "#FCEEED", //light
		error2: "#FCD0CF", //focus
		error3: "#FAB0AF", //disabled
		error4: "#F58D89",
		error5: "#F26661", //hover
		error6: "#E64E45", //normal
		error7: "#CC382F", //click
		error8: "#B32720",
		error9: "#9E1A13",
		error10: "#850E08",

		focus: "#FCD0CF", // error2
		disabled: "#FAB0AF", // error3
		hover: "#F26661", // error4
		normal: "#E64E45", // error5
		click: "#CC382F", // error6
	},
	info: {
		lighter: "#EDF4FF",
		light: "#EDF4FF",
		light2: "#CCDEFC",
		default: "#0756D9",
		dark: "#1976D2",
		darker: "#0D47A1",

		info1: "#EDF4FF", //light
		info2: "#CCDEFC", //focus
		info3: "#9BBFFA", //disabled
		info4: "#66A1FF",
		info5: "#1976D2", //hover
		info6: "#0756D9", //normal
		info7: "#0742B4", //click
		info8: "#073C8C",
		info9: "#072864",
		info10: "#071D46",

		focus: "#CCDEFC", // info2
		disabled: "#9BBFFA", // info3
		hover: "#1976D2", // info4
		normal: "#0756D9", // info5
		click: "#0742B4", // info6
	},
	link: {
		lighter: "#EDF4FF",
		light: "#EDF4FF",
		light2: "#CCDEFC",
		default: "#0756D9",
		dark: "#1976D2",
		darker: "#0D47A1",

		link1: "#EDF4FF", //light
		link2: "#CCDEFC", //focus
		link3: "#9BBFFA", //disabled
		link4: "#66A1FF",
		link5: "#1976D2", //hover
		link6: "#0756D9", //normal
		link7: "#0742B4", //click
		link8: "#073C8C",
		link9: "#072864",
		link10: "#071D46",

		focus: "#CCDEFC", // link2
		disabled: "#9BBFFA", // link3
		hover: "#1976D2", // link4
		normal: "#0756D9", // link5
		click: "#0742B4", // link6
	},
	gray: {
		// 表格斑马纹颜色
		"50": "#FAFAFA",
		// 100-1000 对应 ui规范中的 1-10
		"100": "#F9F9FB",
		"200": "#F4F5F6",
		"300": "#E6E7E8",
		"400": "#CECFD0",
		"500": "#C0C1C2",
		"600": "#B1B2B3",
		"700": "#9FA0A1",
		"800": "#88898A",
		"900": "#656666",
		"1000": "#515152",
	},
	text: {
		// 亮色模式文本颜色
		white: "#FFFFFF",
		// ui 规范中对应的颜色 1-14
		text1: "#F1F1F3",
		text2: "#EBEBED",
		text3: "#E3E3E6",
		text4: "#D6D6D9",
		text5: "#C8C9CC",
		text6: "#AAABAD",
		text7: "#84868A",
		text8: "#6B6C70",
		text9: "#57595C",
		text10: "#45484D",
		text11: "#242933",
		text12: "#4A4A4D",
		text13: "#12161F",
		text14: "#0E1017",

		// 暗色模式文本颜色
		darkText1: "#FFFFFF",
		darkText2: "#F8F8F8",
		darkText3: "#F0F0F0",
		darkText4: "#E8E8E8",
		darkText5: "#E0E0E0",
		darkText6: "#D0D0D0",
		darkText7: "#C0C0C0",
		darkText8: "#B0B0B0",
		darkText9: "#A0A0A0",
		darkText10: "#909090",
		darkText11: "#808080",
		darkText12: "#707070",
		darkText13: "#606060",
		darkText14: "#505050",

		// ui规范中的语意化文本颜色
		textDisabled: "#D6D6D9", // 亮色模式禁用/提示文本 text-4
		textMinimal: "#AAABAD", // 亮色模式极次要文本 text-6
		textMinor: "#717275", // 亮色模式次要文本 text-8
		textSecondary: "#45484D", // 亮色模式次重要文本 text-10
		textPrimary: "#151923", // 亮色模式重要文本 text-12

		darkTextDisabled: "#808080", // 暗色模式禁用/提示文本 darkText-4
		darkTextMinimal: "#909090", // 暗色模式极次要文本 darkText-6
		darkTextMinor: "#A0A0A0", // 暗色模式次要文本 darkText-8
		darkTextSecondary: "#B0B0B0", // 暗色模式次重要文本 darkText-10
		darkTextPrimary: "#E8E8E8", // 暗色模式主要文本 darkText-12
	},
};

export const commonColors = {
	white: "#FFFFFF",
	black: "#09090B",
};

export const actionColors = {
	hover: rgbAlpha(paletteColors.gray[500], 0.1),
	selected: rgbAlpha(paletteColors.gray[500], 0.1),
	focus: rgbAlpha(paletteColors.gray[500], 0.12),
	disabled: rgbAlpha(paletteColors.gray[500], 0.48),
	active: rgbAlpha(paletteColors.gray[500], 1),
};

export const lightColorTokens = {
	palette: paletteColors,
	common: commonColors,
	action: actionColors,
	text: {
		primary: paletteColors.text.textPrimary,
		secondary: paletteColors.text.textMinor,
		disabled: paletteColors.text.textDisabled,
		// olt ui规范的文字色系列
		white: paletteColors.text.white,
		text1: paletteColors.text.text1,
		text2: paletteColors.text.text2,
		text3: paletteColors.text.text3,
		text4: paletteColors.text.text4,
		text5: paletteColors.text.text5,
		text6: paletteColors.text.text6,
		text7: paletteColors.text.text7,
		text8: paletteColors.text.text8,
		text9: paletteColors.text.text9,
		text10: paletteColors.text.text10,
		text11: paletteColors.text.text11,
		text12: paletteColors.text.text12,
		text13: paletteColors.text.text13,
		text14: paletteColors.text.text14,

		// ui规范中的语意化文本颜色
		textDisabled: paletteColors.text.textDisabled,
		textMinimal: paletteColors.text.textMinimal,
		textMinor: paletteColors.text.textMinor,
		textSecondary: paletteColors.text.textSecondary,
		textPrimary: paletteColors.text.textPrimary,
	},
	background: {
		default: commonColors.white,
		paper: commonColors.white,
		neutral: paletteColors.gray[200],
		stripe: paletteColors.gray[50],
	},
};

export const darkColorTokens = {
	palette: paletteColors,
	common: commonColors,
	action: actionColors,
	text: {
		primary: commonColors.white,
		secondary: paletteColors.gray[500],
		disabled: paletteColors.gray[600],
		// olt ui规范的文字色系列
		white: paletteColors.text.darkText1,
		text1: paletteColors.text.darkText2,
		text2: paletteColors.text.darkText3,
		text3: paletteColors.text.darkText4,
		text4: paletteColors.text.darkText5,
		text5: paletteColors.text.darkText6,
		text6: paletteColors.text.darkText7,
		text7: paletteColors.text.darkText8,
		text8: paletteColors.text.darkText9,
		text9: paletteColors.text.darkText10,
		text10: paletteColors.text.darkText11,
		text11: paletteColors.text.darkText12,
		text12: paletteColors.text.darkText13,
		text13: paletteColors.text.darkText14,
		text14: paletteColors.text.darkText14,

		// ui规范中的语意化文本颜色
		textDisabled: paletteColors.text.darkTextDisabled,
		textMinimal: paletteColors.text.darkTextMinimal,
		textMinor: paletteColors.text.darkTextMinor,
		textSecondary: paletteColors.text.darkTextSecondary,
		textPrimary: paletteColors.text.darkTextPrimary,
	},
	background: {
		default: commonColors.black,
		paper: commonColors.black,
		neutral: "#27272A",
		stripe: "#27272A",
	},
};
