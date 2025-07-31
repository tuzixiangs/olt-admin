import { Icon } from "@/components/icon";
import { useSettings } from "@/store/settingStore";
import { themeVars } from "@/theme/theme.css";
import { rgbAlpha } from "@/utils/theme";
import { Toaster } from "sonner";
import styled from "styled-components";

/**
 * https://sonner.emilkowal.ski/getting-started
 */
export default function Toast() {
	const { themeMode } = useSettings();

	return (
		<ToasterStyleWrapper>
			<Toaster
				position="top-center"
				theme={themeMode}
				toastOptions={{
					duration: 3000,
					style: {
						backgroundColor: themeVars.colors.background.paper,
					},
					classNames: {
						toast: "rounded-lg !border-0 p-4",
						description: "text-xs ",
						content: "flex-1 ml-2",
						icon: "flex items-center justify-center rounded-lg",
						success: "bg-success/10",
						error: "bg-error/10",
						warning: "bg-warning/10",
						info: "bg-info/10",
					},
				}}
				icons={{
					success: <Icon icon="carbon:checkmark-filled" size={24} color={themeVars.colors.palette.success.default} />,
					error: (
						<Icon icon="ant-design:close-circle-filled" size={24} color={themeVars.colors.palette.error.default} />
					),
					warning: (
						<Icon
							icon="ant-design:exclamation-circle-filled"
							size={24}
							color={themeVars.colors.palette.warning.default}
						/>
					),
					info: <Icon icon="ant-design:info-circle-filled" size={24} color={themeVars.colors.palette.info.default} />,
					loading: <Icon className="animate-spin" icon="ant-design:loading-outlined" size={20} speed={3} />,
				}}
				expand
			/>
		</ToasterStyleWrapper>
	);
}

const ToasterStyleWrapper = styled.div`
  [data-sonner-toast] {
    font-weight: 600;
    font-size: 14px;

    /* Toast 模式样式 */
    &.toast-mode {
      padding: 10px 12px !important;
      
      /* Toast 模式下图标大小为14px */
      [data-icon] svg {
        width: 18px !important;
        height: 18px !important;
        margin-left: 6px;
      }
    }

    /* Notification 模式样式 */
    &.notification-mode {
      padding: 16px !important;
      
      [data-icon] {
        align-self: flex-start;
        margin-top: 0;
        margin-right: 12px;
        margin-left: 0;
      }
      
      /* Notification 模式下图标大小保持24px */
      [data-icon] svg {
        width: 24px !important;
        height: 24px !important;
      }
      
      [data-content] {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        margin-left: 0;
      }
      
      /* 确保 icon 和内容在同一行 */
      > div {
        display: flex;
        align-items: flex-start;
        gap: 12px;
      }
    }

    [data-cancel] {
      color: ${themeVars.colors.text.primary};
      background-color: transparent;
      &:hover {
        background-color: ${rgbAlpha(themeVars.colors.text.primaryChannel, 0.08)};
      }
    }

    /* Default */
    [data-action] {
      color: ${themeVars.colors.palette.primary.default};
      background-color: transparent;
      &:hover {
        background-color: ${rgbAlpha(themeVars.colors.palette.primary.defaultChannel, 0.08)};
      }
    }

    /* Info */
    &[data-type="info"] [data-action] {
      color: ${themeVars.colors.palette.info.default};
      background-color: transparent;
      &:hover {
        background-color: ${rgbAlpha(themeVars.colors.palette.info.defaultChannel, 0.08)};
      }
    }

    /* Error */
    &[data-type="error"] [data-action] {
      color: ${themeVars.colors.palette.error.default};
      background-color: transparent;
      &:hover {
        background-color: ${rgbAlpha(themeVars.colors.palette.error.defaultChannel, 0.08)};
      }
    }

    /* Success */
    &[data-type="success"] [data-action] {
      color: ${themeVars.colors.palette.success.default};
      background-color: transparent;
      &:hover {
        background-color: ${rgbAlpha(themeVars.colors.palette.success.defaultChannel, 0.08)};
      }
    }

    /* Warning */
    &[data-type="warning"] [data-action] {
      color: ${themeVars.colors.palette.warning.default};
      background-color: transparent;
      &:hover {
        background-color: ${rgbAlpha(themeVars.colors.palette.warning.defaultChannel, 0.08)};
      }
    }

    /* Loading */
    &[data-type="loading"] [data-icon] .sonner-loader[data-visible="true"] {
      margin-left: 6px;
      color: ${themeVars.colors.palette.primary.default};
      position: absolute;
    }

    /* Close Button */
    [data-close-button] {
      top: 14px;
      right: 0;
      left: auto;
      background-color: transparent !important;
      border: none !important;
      border-width: 0 !important;
      border-style: none !important;
      box-shadow: none !important;
    }

    [data-description] {
      color: ${themeVars.colors.text.primary};
    }
  }
`;
