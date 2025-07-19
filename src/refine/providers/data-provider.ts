import { GLOBAL_CONFIG } from "@/global-config";
import dataProvider from "@refinedev/simple-rest";

const API_BASE_URL = GLOBAL_CONFIG.apiBaseUrl;
const REFINE_URL = "https://api.fake-rest.refine.dev";

export const dataProviders = {
	default: dataProvider(API_BASE_URL),
	refine: dataProvider(REFINE_URL),
};
