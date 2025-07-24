import { useSettings } from "@/store/settingStore";
import { useEffect } from "react";
import { HtmlDataAttribute } from "#/enum";
import type { UILibraryAdapter } from "./type";

/**
 * ThemeProvider 组件的属性接口
 */
interface ThemeProviderProps {
	/**
	 * 子组件
	 */
	children: React.ReactNode;
	
	/**
	 * UI 库适配器数组
	 * 用于将主题应用到第三方 UI 库（如 Ant Design）
	 */
	adapters?: UILibraryAdapter[];
}

/**
 * 主题提供者组件
 * 负责将主题设置应用到整个应用，并提供对第三方 UI 库的支持
 * 
 * @example
 * ```tsx
 * <ThemeProvider adapters={[AntdAdapter]}>
 *   <App />
 * </ThemeProvider>
 * ```
 */
export function ThemeProvider({ children, adapters = [] }: ThemeProviderProps) {
	// 从全局设置中获取当前主题配置
	const { themeMode, themeColorPresets, fontFamily, fontSize } = useSettings();

	/**
	 * 更新 HTML 元素上的主题模式属性
	 * 用于 CSS 变量和 Tailwind 的主题切换
	 */
	useEffect(() => {
		const root = window.document.documentElement;
		// 设置 data-theme-mode 属性，如 data-theme-mode="light" 或 data-theme-mode="dark"
		root.setAttribute(HtmlDataAttribute.ThemeMode, themeMode);
	}, [themeMode]); // 仅在 themeMode 变化时执行

	/**
	 * 更新 HTML 元素上的主题色预设属性
	 * 用于动态切换主题色
	 */
	useEffect(() => {
		const root = window.document.documentElement;
		// 设置 data-color-palette 属性，如 data-color-palette="default"
		root.setAttribute(HtmlDataAttribute.ColorPalette, themeColorPresets);
	}, [themeColorPresets]); // 仅在 themeColorPresets 变化时执行

	/**
	 * 更新字体大小和字体族
	 * 直接修改根元素的样式属性
	 */
	useEffect(() => {
		const root = window.document.documentElement;
		// 设置根元素的字体大小
		root.style.fontSize = `${fontSize}px`;

		const body = window.document.body;
		// 设置 body 元素的字体族
		body.style.fontFamily = fontFamily;
	}, [fontFamily, fontSize]); // 在 fontFamily 或 fontSize 变化时执行

	/**
	 * 使用 reduce 方法将所有适配器组件包装在 children 外层
	 * 这样可以确保适配器按顺序应用，形成嵌套结构
	 * 
	 * @example
	 * 如果 adapters = [Adapter1, Adapter2]，则结果为：
	 * <Adapter1>
	 *   <Adapter2>
	 *     {children}
	 *   </Adapter2>
	 * </Adapter1>
	 */
	const wrappedWithAdapters = adapters.reduce(
		(children, Adapter) => (
			<Adapter key={Adapter.name} mode={themeMode}>
				{children}
			</Adapter>
		),
		children,
	);

	return wrappedWithAdapters;
}