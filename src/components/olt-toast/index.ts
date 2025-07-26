import { themeVars } from "@/theme/theme.css";
import { type ExternalToast, toast as sonnerToast } from "sonner";

interface CustomToastOptions extends ExternalToast {
	mode?: "toast" | "notification";
	enableBackground?: boolean;
	backgroundColor?: string;
}

const backgroundColorMap = {
	success: themeVars.colors.palette.success.light,
	error: themeVars.colors.palette.error.light,
	warning: themeVars.colors.palette.warning.light,
	info: themeVars.colors.palette.info.light,
	loading: themeVars.colors.background.paper,
	default: themeVars.colors.background.paper,
};

const createToastWithConfig = (type: "success" | "error" | "warning" | "info" | "loading" | "default") => {
	return (message: string, options: CustomToastOptions = {}) => {
		const {
			mode = "toast",
			enableBackground = true,
			backgroundColor = backgroundColorMap[type] || themeVars.colors.background.paper,
			position,
			duration,
			description,
			action,
			cancel,
			...restOptions
		} = options;

		// 根据模式设置不同的样式
		const modeStyles =
			mode === "toast"
				? {
						padding: "10px 12px",
					}
				: {
						padding: "16px",
					};

		const processedDuration = duration === 0 ? Number.POSITIVE_INFINITY : duration;

		const toastOptions = {
			position,
			duration: processedDuration,
			description,
			action,
			cancel,
			style: enableBackground
				? {
						backgroundColor,
						backdropFilter: "blur(8px)",
						...modeStyles,
					}
				: modeStyles,
			className: mode === "notification" ? "notification-mode" : "toast-mode",
			...restOptions,
		};

		// 过滤掉 undefined 值
		const filteredOptions = Object.fromEntries(
			Object.entries(toastOptions).filter(([_, value]) => value !== undefined),
		);

		switch (type) {
			case "success":
				return sonnerToast.success(message, filteredOptions);
			case "error":
				return sonnerToast.error(message, filteredOptions);
			case "warning":
				return sonnerToast.warning(message, filteredOptions);
			case "info":
				return sonnerToast.info(message, filteredOptions);
			case "loading":
				return sonnerToast.loading(message, filteredOptions);
			default:
				return sonnerToast(message, filteredOptions);
		}
	};
};

// 导出自定义 toast 函数
const toastMethods = {
	success: createToastWithConfig("success"),
	error: createToastWithConfig("error"),
	warning: createToastWithConfig("warning"),
	info: createToastWithConfig("info"),
	loading: createToastWithConfig("loading"),
	default: createToastWithConfig("default"),

	// 保持原有的 promise 方法
	promise: sonnerToast.promise,

	// 添加一个特殊的带背景色的快捷方法
	withBackground: (
		message: string,
		options: Omit<CustomToastOptions, "enableBackground"> & { type?: "success" | "error" | "warning" | "info" },
	) => {
		const { type = "default", ...restOptions } = options;
		return createToastWithConfig(type)(message, {
			enableBackground: true,
			backgroundColor: themeVars.colors.background.paper,
			...restOptions,
		});
	},
};

const toastFunction = (message: string, options: CustomToastOptions = {}) => {
	return createToastWithConfig("default")(message, options);
};

Object.assign(toastFunction, toastMethods);

export const toast = toastFunction as typeof toastFunction & typeof toastMethods;
