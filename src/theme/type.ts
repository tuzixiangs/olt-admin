import type { ThemeMode } from "#/enum";

/**
 * 主题 tokens 结构定义
 * 这是一个"契约"，定义了所有可用的主题变量结构，但不包含实际值
 * 每个值都初始化为 null，实际值将在 theme.css.ts 中设置
 */
export const themeTokens = {
	/**
	 * 颜色系统
	 * 包含调色板、通用颜色、动作状态颜色、文本颜色和背景颜色
	 */
	colors: {
		/**
		 * 调色板颜色
		 * 包含各种语义化颜色及其不同深浅变体
		 */
		palette: {
			/**
			 * 主要颜色
			 * 用于应用的主要交互元素
			 */
			primary: {
				lighter: null, // 最浅色
				light: null, // 浅色
				default: null, // 默认色
				dark: null, // 深色
				darker: null, // 最深色

				brand1: null,
				brand2: null,
				brand3: null,
				brand4: null,
				brand5: null,
				brand6: null,
				brand7: null,
				brand8: null, // default
				brand9: null,
				brand10: null,

				focus: null,
				disabled: null,
				hover: null,
				normal: null,
				click: null,
			},
			/**
			 * 成功颜色
			 * 用于表示成功状态或积极操作
			 */
			success: {
				lighter: null,
				light: null,
				light2: null, // 额外的浅色变体
				default: null,
				dark: null,
				darker: null,

				success1: null,
				success2: null,
				success3: null,
				success4: null,
				success5: null,
				success6: null,
				success7: null,
				success8: null,
				success9: null,
				success10: null,

				focus: null,
				disabled: null,
				hover: null,
				normal: null,
				click: null,
			},
			/**
			 * 警告颜色
			 * 用于表示警告状态或需要注意的操作
			 */
			warning: {
				lighter: null,
				light: null,
				light2: null,
				default: null,
				dark: null,
				darker: null,

				warning1: null,
				warning2: null,
				warning3: null,
				warning4: null,
				warning5: null,
				warning6: null,
				warning7: null,
				warning8: null,
				warning9: null,
				warning10: null,

				focus: null,
				disabled: null,
				hover: null,
				normal: null,
				click: null,
			},
			/**
			 * 错误颜色
			 * 用于表示错误状态或危险操作
			 */
			error: {
				lighter: null,
				light: null,
				light2: null,
				default: null,
				dark: null,
				darker: null,

				error1: null,
				error2: null,
				error3: null,
				error4: null,
				error5: null,
				error6: null,
				error7: null,
				error8: null,
				error9: null,
				error10: null,

				focus: null,
				disabled: null,
				hover: null,
				normal: null,
				click: null,
			},
			/**
			 * 信息颜色
			 * 用于表示信息性内容
			 */
			info: {
				lighter: null,
				light: null,
				light2: null,
				default: null,
				dark: null,
				darker: null,

				info1: null,
				info2: null,
				info3: null,
				info4: null,
				info5: null,
				info6: null,
				info7: null,
				info8: null,
				info9: null,
				info10: null,

				focus: null,
				disabled: null,
				hover: null,
				normal: null,
				click: null,
			},
			/**
			 * 链接颜色
			 * 用于超链接
			 */
			link: {
				lighter: null,
				light: null,
				light2: null,
				default: null,
				dark: null,
				darker: null,

				link1: null,
				link2: null,
				link3: null,
				link4: null,
				link5: null,
				link6: null,
				link7: null,
				link8: null,
				link9: null,
				link10: null,

				focus: null,
				disabled: null,
				hover: null,
				normal: null,
				click: null,
			},
			/**
			 * 灰色系
			 * 从 50（最浅）到 1000（最深）的灰色渐变
			 */
			gray: {
				"50": null,
				"100": null,
				"200": null,
				"300": null,
				"400": null,
				"500": null,
				"600": null,
				"700": null,
				"800": null,
				"900": null,
				"1000": null,
			},
			/**
			 * 文本颜色系列
			 * 从 text1（最浅）到 text14（最深）的文本颜色
			 */
			text: {
				white: null,
				// 亮色文本
				text1: null,
				text2: null,
				text3: null,
				text4: null,
				text5: null,
				text6: null,
				text7: null,
				text8: null,
				text9: null,
				text10: null,
				text11: null,
				text12: null,
				text13: null,
				text14: null,

				// 暗色模式文本颜色
				darkText1: null,
				darkText2: null,
				darkText3: null,
				darkText4: null,
				darkText5: null,
				darkText6: null,
				darkText7: null,
				darkText8: null,
				darkText9: null,
				darkText10: null,
				darkText11: null,
				darkText12: null,
				darkText13: null,
				darkText14: null,

				// ui规范中的语意化文本颜色
				/** 禁用提示色 */
				textDisabled: null,
				/** 极次要文本 */
				textMinimal: null,
				/** 次要文本 */
				textMinor: null,
				/** 次重要文本 */
				textSecondary: null,
				/** 重要文本 */
				textPrimary: null,

				darkTextDisabled: null,
				darkTextMinimal: null,
				darkTextMinor: null,
				darkTextSecondary: null,
				darkTextPrimary: null,
			},
		},
		/**
		 * 通用颜色
		 * 基础的黑白颜色定义
		 */
		common: {
			white: null, // 白色
			black: null, // 黑色
		},
		/**
		 * 动作状态颜色
		 * 用于表示用户交互状态的颜色
		 */
		action: {
			hover: null, // 悬停状态
			selected: null, // 选中状态
			focus: null, // 聚焦状态
			disabled: null, // 禁用状态
			active: null, // 激活状态
		},
		/**
		 * 文本颜色
		 * 语义化的文本颜色定义
		 */
		text: {
			primary: null, // 主要文本颜色
			secondary: null, // 次要文本颜色
			disabled: null, // 禁用文本颜色
			white: null, // 白色文本
			text1: null, // 扩展文本色系列
			text2: null,
			text3: null,
			text4: null,
			text5: null,
			text6: null,
			text7: null,
			text8: null,
			text9: null,
			text10: null,
			text11: null,
			text12: null,
			text13: null,
			text14: null,
			/** 禁用提示色 */
			textDisabled: null,
			/** 极次要文本 */
			textMinimal: null,
			/** 次要文本 */
			textMinor: null,
			/** 次重要文本 */
			textSecondary: null,
			/** 重要文本 */
			textPrimary: null,
		},
		/**
		 * 背景颜色
		 * 语义化的背景颜色定义
		 */
		background: {
			default: null, // 默认背景色（页面背景）
			paper: null, // 纸质背景色（卡片、面板等）
			neutral: null, // 中性背景色（细微背景）
			stripe: null, // 条纹背景色
		},
	},

	/**
	 * 排版系统
	 * 包含字体族、字体大小、字重和行高
	 */
	typography: {
		/**
		 * 字体族
		 * 定义应用中使用的字体
		 */
		fontFamily: {
			openSans: null, // Open Sans 字体
			inter: null, // Inter 字体
		},
		/**
		 * 字体大小
		 * 从 xs（最小）到 xl（最大）的字体大小
		 */
		fontSize: {
			xs: null, // 额外小号字体
			sm: null, // 小号字体
			default: null, // 默认字体大小
			lg: null, // 大号字体
			xl: null, // 额外大号字体
		},
		/**
		 * 字体粗细
		 * 从 light（细）到 bold（粗）的字重
		 */
		fontWeight: {
			light: null, // 细体
			normal: null, // 正常
			medium: null, // 中等
			semibold: null, // 半粗体
			bold: null, // 粗体
		},
		/**
		 * 行高
		 * 文本行间距设置
		 */
		lineHeight: {
			none: null, // 无行高
			tight: null, // 紧凑行高
			normal: null, // 正常行高
			relaxed: null, // 宽松行高
		},
	},

	/**
	 * 间距系统
	 * 用于 margin、padding、gap 等的间距值
	 * 数字越大间距越大
	 */
	spacing: {
		0: null, // 无间距
		1: null, // 最小间距 (4px)
		2: null, // (8px)
		3: null, // (12px)
		4: null, // (16px)
		5: null, // (20px)
		6: null, // (24px)
		7: null, // (28px)
		8: null, // (32px)
		10: null, // (40px)
		12: null, // (48px)
		16: null, // (64px)
		20: null, // (80px)
		24: null, // (96px)
		32: null, // (128px)
	},

	/**
	 * 圆角系统
	 * 用于元素的 border-radius 属性
	 */
	borderRadius: {
		none: null, // 无圆角 (0px)
		sm: null, // 小圆角 (2px)
		default: null, // 默认圆角 (4px)
		md: null, // 中等圆角 (6px)
		lg: null, // 大圆角 (8px)
		xl: null, // 超大圆角 (12px)
		full: null, // 完全圆角 (9999px)
	},

	/**
	 * 阴影系统
	 * 用于元素的 box-shadow 属性
	 */
	shadows: {
		none: null, // 无阴影
		sm: null, // 小阴影
		default: null, // 默认阴影
		md: null, // 中等阴影
		lg: null, // 大阴影
		xl: null, // 超大阴影
		"2xl": null, // 2倍大阴影
		"3xl": null, // 3倍大阴影
		inner: null, // 内阴影
		dialog: null, // 对话框阴影
		card: null, // 卡片阴影
		dropdown: null, // 下拉菜单阴影
		primary: null, // 主色阴影
		info: null, // 信息色阴影
		success: null, // 成功色阴影
		warning: null, // 警告色阴影
		error: null, // 错误色阴影
	},

	/**
	 * 屏幕断点
	 * 用于响应式设计的媒体查询断点
	 */
	screens: {
		xs: null, // 超小屏幕 (375px)
		sm: null, // 小屏幕 (576px)
		md: null, // 中等屏幕 (768px)
		lg: null, // 大屏幕 (1024px)
		xl: null, // 超大屏幕 (1280px)
		"2xl": null, // 2倍超大屏幕 (1536px)
	},

	/**
	 * 透明度系统
	 * 用于元素的 opacity 属性
	 */
	opacity: {
		0: null, // 完全透明 (0%)
		5: null, // (5%)
		10: null, // (10%)
		20: null, // (20%)
		25: null, // (25%)
		30: null, // (30%)
		35: null, // (35%)
		40: null, // (40%)
		45: null, // (45%)
		50: null, // 半透明 (50%)
		55: null, // (55%)
		60: null, // (60%)
		65: null, // (65%)
		70: null, // (70%)
		75: null, // (75%)
		80: null, // (80%)
		85: null, // (85%)
		90: null, // (90%)
		95: null, // (95%)
		100: null, // 完全不透明 (100%)
		border: null, // 边框透明度 (20%)
		hover: null, // 悬停状态透明度 (8%)
		selected: null, // 选中状态透明度 (16%)
		focus: null, // 聚焦状态透明度 (24%)
		disabled: null, // 禁用状态透明度 (80%)
		disabledBackground: null, // 禁用背景透明度 (24%)
	},

	/**
	 * z-index 层级系统
	 * 用于控制元素的层叠顺序
	 */
	zIndex: {
		appBar: null, // 应用栏层级 (10)
		drawer: null, // 抽屉层级 (50)
		nav: null, // 导航层级 (20)
		modal: null, // 模态框层级 (50)
		snackbar: null, // 快讯层级 (50)
		tooltip: null, // 工具提示层级 (50)
		scrollbar: null, // 滚动条层级 (100)
	},
};

export type ThemeTokens = typeof themeTokens;

/**
 * UI 库适配器组件的属性接口
 */
export type UILibraryAdapterProps = {
	mode: ThemeMode; // 当前主题模式
	children: React.ReactNode; // 子组件
};

/**
 * UI 库适配器组件类型
 * 这是一个 React 函数组件类型，接收 UILibraryAdapterProps 属性
 */
export type UILibraryAdapter = React.FC<UILibraryAdapterProps>;

/**
 * 判断是否为叶子对象的类型
 * 如果 T 是对象且其所有属性值都是 null 或 string，则返回 true，否则返回 false
 */
export type IsLeafObject<T> = T extends object ? (T[keyof T] extends null | string ? true : false) : false;

/**
 * 为叶子对象添加通道属性的类型
 * 递归地为对象的叶子节点添加 Channel 后缀的属性
 */
export type AddChannelToLeaf<T> = T extends object
	? IsLeafObject<T> extends true
		? T & { [K in keyof T as `${string & K}Channel`]: string } // 仅为叶子节点添加通道属性
		: { [K in keyof T]: AddChannelToLeaf<T[K]> } // 递归处理其他层级
	: T;
