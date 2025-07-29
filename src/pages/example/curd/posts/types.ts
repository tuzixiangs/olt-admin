export interface IPost {
	id: string;
	title: string;
	content: string;
	status: "enable" | "disable";
}

export interface IListResult<T> {
	total: number;
	pageSize: number;
	pageNum: number;
	totalPages: number;
	totalElements: number;
	content: T[];
}

export interface PostQueryParams {
	current?: number;
	pageSize?: number;
	title?: string;
	status?: string;
}
