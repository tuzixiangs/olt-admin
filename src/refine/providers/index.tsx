import { Refine } from "@refinedev/core";
import type { RefineProps } from "@refinedev/core";
import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools";
import { UnsavedChangesNotifier } from "@refinedev/react-router";
import { resources } from "../resources";
import { dataProviders } from "./data-provider";
import { routerProvider } from "./router-provider";

interface RefineProviderProps {
	children: React.ReactNode;
	/** 自定义 Refine 配置，会与默认配置合并 */
	refineProps?: Partial<RefineProps>;
}

export const RefineProvider = ({ children, refineProps }: RefineProviderProps) => {
	const defaultProps: RefineProps = {
		routerProvider,
		dataProvider: dataProviders,
		resources,
		options: {
			syncWithLocation: false,
			warnWhenUnsavedChanges: true,
		},
		...refineProps, // 允许覆盖默认配置
	};

	return (
		<DevtoolsProvider>
			<Refine
				{...defaultProps}
				options={{
					projectId: "4urhet-h9icpq-yRdl3p",
				}}
			>
				{children}
				<UnsavedChangesNotifier />
				<DevtoolsPanel />
			</Refine>
		</DevtoolsProvider>
	);
};
