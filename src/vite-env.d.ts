/// <reference types="vite/client" />

interface ImportMetaEnv {
	/** Default route path for the application */
	readonly VITE_APP_DEFAULT_ROUTE: string;
	/** Public path for static assets */
	readonly VITE_APP_PUBLIC_PATH: string;
	/** Base URL for API endpoints */
	readonly VITE_APP_API_BASE_URL: string;
	/** Routing mode: frontend routing or backend routing */
	readonly VITE_APP_ROUTER_MODE: "frontend" | "backend";
	/** Local proxy URL */
	readonly VITE_APP_LOCAL_PROXY_URL: string;
	/** local mock proxy url */
	readonly VITE_APP_MOCK_LOCAL_PROXY_URL: string;
	/** local base url for mock */
	readonly VITE_APP_MOCK_API_BASE_URL: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
