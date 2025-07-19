import { faker } from "@faker-js/faker";
import { http, HttpResponse } from "msw";

// 测试新增文章
export const createArticle = http.post("/api/article", async ({ request }) => {
	const { title, content } = (await request.json()) as Record<string, string>;

	const article = {
		id: faker.string.uuid(),
		title,
		content,
	};

	return HttpResponse.json(article);
});

// 测试获取文章
export const getArticle = http.get("/api/article/:id", async ({ request }) => {
	const { id } = (await request.json()) as Record<string, string>;

	const article = {
		id,
		title: faker.lorem.sentence(),
		content: faker.lorem.paragraph(),
	};

	return HttpResponse.json(article);
});

// 测试更新文章
export const updateArticle = http.put("/api/article/:id", async ({ request }) => {
	const { id } = (await request.json()) as Record<string, string>;

	const article = {
		id,
		title: faker.lorem.sentence(),
		content: faker.lorem.paragraph(),
	};

	return HttpResponse.json(article);
});

// 测试删除文章
export const deleteArticle = http.delete("/api/article/:id", async ({ request }) => {
	const { id } = (await request.json()) as Record<string, string>;

	return HttpResponse.json({ id });
});

// 测试获取文章列表
export const getArticleList = http.get("/api/article", async ({ request }) => {
	const { page, pageSize } = (await request.json()) as Record<string, number>;

	const articles = Array.from({ length: pageSize }, () => ({
		id: faker.string.uuid(),
		title: faker.lorem.sentence(),
		content: faker.lorem.paragraph(),
	}));

	return HttpResponse.json({
		data: articles,
		total: articles.length,
	});
});
