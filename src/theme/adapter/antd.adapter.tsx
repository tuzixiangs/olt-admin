import useLocale from "@/locales/use-locale";
import { StyleProvider } from "@ant-design/cssinjs";
import type { ThemeConfig } from "antd";
import { App, ConfigProvider, theme } from "antd";
import { ThemeMode } from "#/enum";
import { baseThemeTokens } from "../tokens/base";
import { darkColorTokens, lightColorTokens, presetsColors } from "../tokens/color";
import { darkShadowTokens, lightShadowTokens } from "../tokens/shadow";
import type { UILibraryAdapter } from "../type";

import { useSettings } from "@/store/settingStore";
import { removePx } from "@/utils/theme";

/**
 * Ant Design 适配器组件
 * 将我们自定义的主题变量映射到 Ant Design 的主题系统中
 * 实现设计系统与第三方组件库的统一
 *
 * @param mode - 当前主题模式 (light 或 dark)
 * @param children - 子组件
 */
export const AntdAdapter: UILibraryAdapter = ({ mode, children }) => {
	// 获取当前语言设置
	const { language } = useLocale();

	// 从全局设置中获取主题配置
	const { themeColorPresets, fontFamily, fontSize } = useSettings();

	// 根据主题模式选择 Ant Design 的算法
	const algorithm = mode === ThemeMode.Light ? theme.defaultAlgorithm : theme.darkAlgorithm;

	// 根据主题模式选择对应的颜色 tokens
	const colorTokens = mode === ThemeMode.Light ? lightColorTokens : darkColorTokens;

	const shadowTokens = mode === ThemeMode.Light ? lightShadowTokens : darkShadowTokens;

	// 获取当前选择的主题色预设
	const primaryColorToken = presetsColors[themeColorPresets];

	/**
	 * 定义 Ant Design 的主题 token
	 * 将我们的设计系统值映射到 Ant Design 的主题配置中
	 */
	const token: ThemeConfig["token"] = {
		// 主要颜色映射
		colorPrimary: primaryColorToken.default, // 主色
		colorSuccess: colorTokens.palette.success.default, // 成功色
		colorWarning: colorTokens.palette.warning.default, // 警告色
		colorError: colorTokens.palette.error.default, // 错误色
		colorInfo: colorTokens.palette.info.default, // 信息色

		// 背景颜色映射
		colorBgLayout: colorTokens.background.default, // 布局背景色
		colorBgContainer: colorTokens.background.paper, // 容器背景色
		colorBgElevated: colorTokens.background.default, // 浮层背景色

		// 字体设置
		wireframe: false, // 是否使用线框风格
		fontFamily: fontFamily, // 字体族
		fontSize: fontSize, // 字体大小
		colorTextBase: colorTokens.text.primary,

		// 圆角设置 (需要移除 "px" 单位以适配 Ant Design)
		borderRadiusSM: removePx(baseThemeTokens.borderRadius.sm), // 小圆角
		borderRadius: removePx(baseThemeTokens.borderRadius.default), // 默认圆角
		borderRadiusLG: removePx(baseThemeTokens.borderRadius.lg), // 大圆角
	};

	/**
	 * 组件特定的样式配置
	 * 针对特定 Ant Design 组件的定制化配置
	 */
	const components: ThemeConfig["components"] = {
		Button: {
			colorPrimaryHover: colorTokens.palette.primary.hover,
			colorPrimaryActive: colorTokens.palette.primary.click,
			colorPrimaryTextHover: colorTokens.palette.primary.hover,
			colorPrimaryTextActive: colorTokens.palette.primary.click,
			colorPrimaryBg: colorTokens.palette.gray[200],
			colorPrimaryBgHover: colorTokens.palette.gray[400],
			colorPrimaryBorder: colorTokens.palette.gray[400],
			primaryShadow: "none",
			colorTextDisabled: colorTokens.palette.text.textDisabled,

			defaultBorderColor: colorTokens.palette.gray[400],
			dangerShadow: "none",
			defaultShadow: "none",
			borderColorDisabled: "none",
			textHoverBg: colorTokens.palette.gray[200],
			colorLinkHover: colorTokens.palette.link.hover,
			colorLinkActive: colorTokens.palette.link.click,
		},
		Input: {
			colorBorder: colorTokens.palette.gray[400],
			hoverBorderColor: colorTokens.palette.info.hover,
			activeBorderColor: colorTokens.palette.info.default,
			// activeShadow: "0px 2px 8px 0px #D4E3FC",
			colorTextPlaceholder: colorTokens.text.disabled,
			colorTextDisabled: colorTokens.text.textDisabled,
			colorBgContainerDisabled: colorTokens.palette.gray[200],
		},
		Select: {
			colorBorder: colorTokens.palette.gray[400],
			hoverBorderColor: colorTokens.palette.info.hover,
			activeBorderColor: colorTokens.palette.info.default,
			colorTextPlaceholder: colorTokens.text.disabled,
			colorTextDisabled: colorTokens.text.textDisabled,
			colorBgContainerDisabled: colorTokens.palette.gray[200],
			optionSelectedBg: colorTokens.palette.gray[100],
			optionSelectedColor: colorTokens.palette.info.default,
			optionActiveBg: colorTokens.palette.gray[100],
		},
		Tree: {},
		Modal: {
			boxShadow: shadowTokens.lg,
		},
		/**
		 * 面包屑组件配置
		 */
		Breadcrumb: {
			separatorMargin: removePx(baseThemeTokens.spacing[1]), // 分隔符间距
		},

		/**
		 * 菜单组件配置
		 */
		Menu: {
			colorFillAlter: "transparent", // 交替项填充色
			itemColor: colorTokens.text.secondary, // 项目颜色
			motionDurationMid: "0.125s", // 中等动画时长
			motionDurationSlow: "0.125s", // 慢动画时长
			darkItemBg: darkColorTokens.background.default, // 暗色模式项目背景
		},

		/**
		 * 布局组件配置
		 */
		Layout: {
			siderBg: darkColorTokens.background.default, // 侧边栏背景
		},
	};

	/**
	 * 返回配置好的 Ant Design 组件
	 * 通过 ConfigProvider 提供主题配置
	 * 通过 StyleProvider 控制样式优先级
	 * 通过 App 组件提供全局消息提示等功能
	 */
	return (
		// Ant Design 配置提供者
		<ConfigProvider
			// 设置本地化配置
			locale={language.antdLocal}
			// 配置主题算法、token 和组件样式
			theme={{ algorithm, token, components }}
			// 配置标签样式
			tag={{
				style: {
					borderRadius: removePx(baseThemeTokens.borderRadius.md), // 标签圆角
					fontWeight: 700, // 标签字重
					padding: `0 ${baseThemeTokens.spacing[1]}`, // 标签内边距
					margin: `0 ${baseThemeTokens.spacing[1]}`, // 标签外边距
					borderWidth: 0, // 标签边框宽度
				},
			}}
		>
			{/* Ant Design 样式提供者，设置样式优先级 */}
			<StyleProvider hashPriority="high">
				{/* Ant Design 应用组件，提供全局消息提示等功能 */}
				<App>{children}</App>
			</StyleProvider>
		</ConfigProvider>
	);
};
