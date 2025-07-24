import { HtmlDataAttribute, ThemeColorPresets, ThemeMode } from "@/types/enum";
import { addColorChannels } from "@/utils/theme";
import { assignVars, createGlobalTheme, createThemeContract, globalStyle } from "@vanilla-extract/css";
import { baseThemeTokens } from "./tokens/base";
import { darkColorTokens, lightColorTokens, presetsColors } from "./tokens/color";
import { darkShadowTokens, lightShadowTokens } from "./tokens/shadow";
import { typographyTokens } from "./tokens/typography";
import { themeTokens } from "./type";

/**
 * 根据主题模式获取相应的主题 tokens
 * @param theme - 主题模式 (light 或 dark)
 * @returns 对应主题模式的完整主题 tokens 对象
 */
const getThemeTokens = (theme: ThemeMode) => {
	// 根据主题模式选择对应的颜色 tokens
	const themeTokens = theme === ThemeMode.Light ? lightColorTokens : darkColorTokens;
	
	// 组合并返回完整的主题 tokens
	return {
		// 为颜色 tokens 添加 RGB 通道值（用于透明度控制）
		colors: addColorChannels(themeTokens),
		// 排版 tokens
		typography: typographyTokens,
		// 根据主题模式选择对应的阴影 tokens
		shadows: theme === ThemeMode.Light ? lightShadowTokens : darkShadowTokens,
		// 基础 tokens（间距、圆角、z-index 等）
		...baseThemeTokens,
	};
};

/**
 * 创建主题变量契约
 * 这定义了所有可用主题变量的结构，但不包含实际值
 * 使用 createThemeContract 创建一个主题契约，确保类型安全
 */
export const themeVars = createThemeContract({
	// 展开 themeTokens 中的所有属性
	...themeTokens,
	// 为颜色系统添加 RGB 通道值
	colors: addColorChannels(themeTokens.colors),
});

/**
 * 为主题模式创建全局 CSS 变量
 * 遍历所有主题模式，为每种模式创建对应的 CSS 变量
 */
for (const themeMode of Object.values(ThemeMode)) {
	// 为每个主题模式创建全局主题
	// 选择器如 :root[data-theme-mode="light"] 或 :root[data-theme-mode="dark"]
	createGlobalTheme(
		`:root[${HtmlDataAttribute.ThemeMode}=${themeMode}]`, 
		themeVars, 
		getThemeTokens(themeMode)
	);
}

/**
 * 为动态颜色预设创建全局样式
 * 遍历所有颜色预设，为每种预设创建对应的 CSS 变量覆盖
 */
for (const preset of Object.values(ThemeColorPresets)) {
	// 为每个颜色预设创建全局样式
	// 选择器如 :root[data-color-palette="default"]
	globalStyle(`:root[${HtmlDataAttribute.ColorPalette}=${preset}]`, {
		// 分配变量，覆盖主要颜色调色板
		vars: assignVars(themeVars.colors.palette.primary, {
			// 为预设颜色添加 RGB 通道值
			...addColorChannels(presetsColors[preset]),
		}),
	});
}