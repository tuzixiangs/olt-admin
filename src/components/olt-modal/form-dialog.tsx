// import useLocale from "@/locales/use-locale";
// import { BetaSchemaForm, type FormInstance, type ProFormColumnsType } from "@ant-design/pro-components";
// import { forwardRef, useEffect, useImperativeHandle } from "react";

// // TODO: 待完成
// // import type { FormSubmitHandler } from "./types";

// type FormSubmitHandler = (values: any) => Promise<boolean>;
// type FormSubmitHandlerRef = (handler: FormSubmitHandler) => void;
// type onFormHandlerReady = (handler: FormSubmitHandler) => void;

// interface FormDialogProps<T = any> {
// 	/** 表单列配置 */
// 	columns: ProFormColumnsType<T>[];
// 	/** 初始值 */
// 	initialValues?: T;
// 	/** 提交处理函数 */
// 	onSubmit?: (values: T) => Promise<boolean>;
// 	/** 提交成功回调 */
// 	onSuccess?: () => void;
// 	/** 提交失败回调 */
// 	onError?: (error: any) => void;
// 	/** 表单属性 */
// 	formProps?: any;
// 	/** 是否显示内置按钮 */
// 	showSubmitter?: boolean;
// 	/** 当表单处理器设置后的回调 */
// 	// onFormHandlerReady?: (handler: FormSubmitHandler) => void;
// }

// /**
//  * 增强的表单组件，支持与弹窗集成
//  * 通过 forwardRef 暴露表单控制方法给弹窗使用
//  */
// export const FormDialog = forwardRef<FormSubmitHandler, FormDialogProps>(
// 	(
// 		{ columns, initialValues, onSubmit, onSuccess, onError, formProps, showSubmitter = false, onFormHandlerReady },
// 		ref,
// 	) => {
// 		const { t } = useLocale();
// 		let formRef: FormInstance | null = null;

// 		// 创建表单处理器
// 		const formHandler: FormSubmitHandler = {
// 			submit: async () => {
// 				try {
// 					if (!formRef) {
// 						throw new Error("Form ref not available");
// 					}

// 					// 触发表单验证
// 					const values = await formRef.validateFields();

// 					if (onSubmit) {
// 						const success = await onSubmit(values);
// 						if (success) {
// 							onSuccess?.();
// 							return true;
// 						}
// 						return false;
// 					}

// 					// 如果没有提供 onSubmit，默认返回 true
// 					onSuccess?.();
// 					return true;
// 				} catch (error) {
// 					console.error("Form submit error:", error);
// 					onError?.(error);
// 					return false;
// 				}
// 			},

// 			reset: () => {
// 				formRef?.resetFields();
// 			},

// 			getFieldsValue: () => {
// 				return formRef?.getFieldsValue();
// 			},

// 			setFieldsValue: (values: any) => {
// 				formRef?.setFieldsValue(values);
// 			},

// 			validate: async () => {
// 				try {
// 					await formRef?.validateFields();
// 					return true;
// 				} catch {
// 					return false;
// 				}
// 			},
// 		};

// 		// 暴露表单控制方法
// 		useImperativeHandle(ref, () => formHandler);

// 		// 当表单处理器准备好时，通知父组件
// 		// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
// 		useEffect(() => {
// 			if (onFormHandlerReady) {
// 				onFormHandlerReady(formHandler);
// 			}
// 		}, [onFormHandlerReady]);

// 		const handleFinish = async (values: any) => {
// 			const success = await formHandler.submit(values);
// 			return success;
// 		};

// 		return (
// 			<BetaSchemaForm
// 				formRef={(form: FormInstance) => {
// 					formRef = form;
// 				}}
// 				layoutType="Form"
// 				columns={columns}
// 				initialValues={initialValues}
// 				onFinish={showSubmitter ? handleFinish : undefined}
// 				submitter={
// 					showSubmitter
// 						? {
// 								searchConfig: {
// 									submitText: t("common.saveText"),
// 									resetText: t("common.resetText"),
// 								},
// 							}
// 						: false
// 				}
// 				{...formProps}
// 			/>
// 		);
// 	},
// );

// FormDialog.displayName = "FormDialog";
