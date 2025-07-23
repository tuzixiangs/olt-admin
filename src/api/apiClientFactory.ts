import { GLOBAL_CONFIG } from "@/global-config";
import { t } from "@/locales/i18n";
import userStore from "@/store/userStore";
import axios, {
	type AxiosError,
	type AxiosInstance,
	type AxiosRequestConfig,
	type AxiosResponse,
	type CreateAxiosDefaults,
	type InternalAxiosRequestConfig,
} from "axios";
import deepmerge from "deepmerge";
import { toast } from "sonner";
import type { Result } from "#/api";
import { ResultStatus } from "#/enum";

type Interceptor<V> = {
	onFulfilled?: (value: V) => V | Promise<V>;
	onRejected?: (error: any) => any;
};

type ApiClientInterceptors = {
	request?: Interceptor<InternalAxiosRequestConfig>;
	response?: Interceptor<AxiosResponse>;
};

export type ApiClientOptions = CreateAxiosDefaults & {
	interceptors?: ApiClientInterceptors;
	disableCommonInterceptors?: boolean;
};

/**
 * 创建一个带有预设默认值和拦截器的 Axios 实例。
 * 外部传入的配置会和默认配置进行深度合并。
 * @param customConfig - 自定义的 Axios 配置，它会覆盖或合并默认配置
 * @returns an Axios instance
 */
export function createApiClient(customConfig: ApiClientOptions = {}): AxiosInstance {
	const defaultConfig: ApiClientOptions = {
		baseURL: GLOBAL_CONFIG.apiBaseUrl,
		timeout: 50000,
		headers: { "Content-Type": "application/json;charset=utf-8" },
	};

	const { interceptors: customInterceptors, disableCommonInterceptors, ...restCustomConfig } = customConfig;
	const mergedConfig = deepmerge(defaultConfig, restCustomConfig);

	const apiClient = axios.create(mergedConfig);

	if (customInterceptors) {
		apiClient.interceptors.request.use(customInterceptors.request?.onFulfilled, customInterceptors.request?.onRejected);
		apiClient.interceptors.response.use(
			customInterceptors.response?.onFulfilled,
			customInterceptors.response?.onRejected,
		);
	}

	if (!disableCommonInterceptors) {
		apiClient.interceptors.request.use(
			(config: InternalAxiosRequestConfig) => {
				const token = userStore.getState().userToken.accessToken;
				if (token) {
					config.headers.Authorization = `Bearer ${token}`;
				}
				return config;
			},
			(error) => Promise.reject(error),
		);

		// 响应拦截器：统一处理数据结构和错误
		apiClient.interceptors.response.use(
			(res: AxiosResponse<Result<any>>) => {
				if (!res.data) throw new Error(t("sys.api.apiRequestFailed"));
				const { status, data, message } = res.data;
				if (status === ResultStatus.SUCCESS) {
					return data;
				}
				throw new Error(message || t("sys.api.apiRequestFailed"));
			},
			(error: AxiosError<Result>) => {
				const { response, message } = error || {};
				const errMsg = response?.data?.message || message || t("sys.api.errorMessage");
				toast.error(errMsg, { position: "top-center" });
				if (response?.status === 401) {
					userStore.getState().actions.clearUserInfoAndToken();
				}
				return Promise.reject(error);
			},
		);
	}

	return apiClient;
}

export class APIClient {
	private axiosInstance: AxiosInstance;

	constructor(axiosInstance: AxiosInstance) {
		this.axiosInstance = axiosInstance;
	}

	get<T = unknown>(config: AxiosRequestConfig): Promise<T> {
		return this.request<T>({ ...config, method: "GET" });
	}
	post<T = unknown>(config: AxiosRequestConfig): Promise<T> {
		return this.request<T>({ ...config, method: "POST" });
	}
	put<T = unknown>(config: AxiosRequestConfig): Promise<T> {
		return this.request<T>({ ...config, method: "PUT" });
	}
	delete<T = unknown>(config: AxiosRequestConfig): Promise<T> {
		return this.request<T>({ ...config, method: "DELETE" });
	}
	request<T = unknown>(config: AxiosRequestConfig): Promise<T> {
		return this.axiosInstance.request<any, T>(config);
	}
}
