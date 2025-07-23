import { APIClient, createApiClient } from "./apiClientFactory";

const fakeClient = createApiClient({
	baseURL: import.meta.env.VITE_APP_API_BASE_URL,
});

export default new APIClient(fakeClient);
