import { useSettingActions, useSettings } from "@/store/settingStore";
import type { ThemeMode } from "#/enum";
import { themeVars } from "../theme.css";
import { baseThemeTokens } from "../tokens/base";
import { darkColorTokens, lightColorTokens, presetsColors } from "../tokens/color";
import { darkShadowTokens, lightShadowTokens } from "../tokens/shadow";
import { typographyTokens } from "../tokens/typography";

/**
 * 自定义 Hook，用于访问和操作主题相关的信息
 * 提供对当前主题模式、主题变量和设置方法的访问
 * 
 * @returns 包含当前主题模式、设置方法和主题变量的对象
 * 
 * @example
 * ```tsx
 * const { mode, setMode, themeVars, themeTokens } = useTheme();
 * 
 * // 使用主题变量设置样式
 * const styles = {
 *   backgroundColor: themeTokens.color.background.paper,
 *   color: themeTokens.color.text.primary
 * };
 * 
 * // 切换主题模式
 * const toggleTheme = () => {
 *   setMode(mode === 'light' ? 'dark' : 'light');
 * };
 * ```
 */
export function useTheme() {
	// 从全局设置中获取当前主题配置
	const settings = useSettings();
	
	// 获取设置操作方法
	const { setSettings } = useSettingActions();

	// 根据当前主题模式选择合适的颜色 tokens
	let colorTokens = settings.themeMode === "light" ? lightColorTokens : darkColorTokens;

	// 应用当前选择的主题色预设
	colorTokens = {
		...colorTokens,
		// 使用预设颜色覆盖默认的 primary 颜色
		palette: {
			...colorTokens.palette,
			primary: presetsColors[settings.themeColorPresets],
		},
	};

	/**
	 * 返回主题相关的信息和操作方法
	 */
	return {
		/**
		 * 当前主题模式
		 * 值为 "light" 或 "dark"
		 */
		mode: settings.themeMode,
		
		/**
		 * 设置主题模式的方法
		 * @param mode - 新的主题模式
		 */
		setMode: (mode: ThemeMode) => {
			// 更新全局设置中的主题模式
			setSettings({
				...settings,
				themeMode: mode,
			});
		},
		
		/**
		 * CSS 变量契约对象
		 * 包含所有可用主题变量的结构定义
		 * 可在 CSS-in-TS 中使用
		 * 
		 * @example
		 * ```ts
		 * import { style } from '@vanilla-extract/css';
		 * import { themeVars } from '../theme.css';
		 * 
		 * export const card = style({
		 *   backgroundColor: themeVars.colors.background.paper,
		 *   color: themeVars.colors.text.primary,
		 *   borderRadius: themeVars.borderRadius.lg,
		 * });
		 * ```
		 */
		themeVars,
		
		/**
		 * 主题 tokens 对象
		 * 包含所有设计系统值的实际内容
		 * 可在组件逻辑中使用
		 * 
		 * @example
		 * ```tsx
		 * const { themeTokens } = useTheme();
		 * 
		 * // 在组件中直接使用主题值
		 * return (
		 *   <div 
		 *     style={{ 
		 *       backgroundColor: themeTokens.color.background.paper,
		 *       padding: themeTokens.base.spacing[4]
		 *     }}
		 *   >
		 *     主题化内容
		 *   </div>
		 * );
		 * ```
		 */
		themeTokens: {
			/**
			 * 基础主题 tokens
			 * 包含间距、圆角、z-index 等不随主题模式变化的值
			 */
			base: baseThemeTokens,
			
			/**
			 * 颜色 tokens
			 * 根据当前主题模式和颜色预设计算得出
			 */
			color: colorTokens,
			
			/**
			 * 阴影 tokens
			 * 根据当前主题模式选择对应的阴影值
			 */
			shadow: settings.themeMode === "light" ? lightShadowTokens : darkShadowTokens,
			
			/**
			 * 排版 tokens
			 * 包含字体族、字体大小、字重和行高等值
			 */
			typography: typographyTokens,
		},
	};
}