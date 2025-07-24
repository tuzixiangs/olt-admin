import { App } from "antd";
import type React from "react";
import { createContext, useContext } from "react";

// 创建 Modal Context
const ModalContext = createContext<ReturnType<typeof App.useApp> | null>(null);

// Modal Provider 组件
export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const app = App.useApp();

	return <ModalContext.Provider value={app}>{children}</ModalContext.Provider>;
};

// 自定义 Hook 用于访问 Modal 实例
export const useModalContext = () => {
	const context = useContext(ModalContext);

	if (context === undefined) {
		throw new Error("useModalContext must be used within a ModalProvider");
	}

	return context;
};
