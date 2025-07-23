import { ResultStatus } from "@/types/enum";
import { faker } from "@faker-js/faker";
import { http, HttpResponse } from "msw";

let curdData = Array.from({ length: 100 }).map(() => ({
	id: faker.string.uuid(),
	title: faker.lorem.sentence(),
	content: faker.lorem.paragraph(),
	status: faker.helpers.arrayElement(["enable", "disable"]),
	createdAt: faker.date.anytime(),
	updatedAt: faker.date.anytime(),
}));

const curdList = http.get("/api/curd", ({ request }) => {
	const { current, pageSize, title, content, status } = Object.fromEntries(
		new URLSearchParams(new URL(request.url).search),
	);
	const filterData = curdData
		.filter((item) => {
			if (title) return item.title.includes(title);
			if (content) return item.content.includes(content);
			if (status) return item.status === status;
			return true;
		})
		.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

	return HttpResponse.json({
		status: ResultStatus.SUCCESS,
		message: "get list success",
		data: {
			total: filterData.length, // total
			pageSize: Number(pageSize), // pageSize
			pageNum: Number(current), // current
			totalPages: Math.ceil(curdData.length / Number(pageSize)), // totalPages
			totalElements: curdData.length, // totalElements
			content: filterData.slice((Number(current) - 1) * Number(pageSize), Number(current) * Number(pageSize)),
		},
	});
});

const curdDetail = http.get("/api/curd/:id", ({ params }) => {
	const { id } = params;
	return HttpResponse.json({
		status: ResultStatus.SUCCESS,
		message: "get detail success",
		data: curdData.find((item) => item.id === id),
	});
});

const curdCreate = http.post("/api/curd", async ({ request }) => {
	const data = (await request.json()) as Record<string, string>;
	curdData.push({
		id: faker.string.uuid(),
		title: data.title,
		content: data.content,
		status: data.status,
		createdAt: faker.date.recent(),
		updatedAt: faker.date.recent(),
	});
	return HttpResponse.json({
		status: ResultStatus.SUCCESS,
		message: "create success",
		data: curdData[curdData.length - 1],
	});
});

const curdUpdate = http.put("/api/curd/:id", async ({ request, params }) => {
	const { id } = params;
	const data = (await request.json()) as Record<string, string>;
	const index = curdData.findIndex((item) => item.id === id);
	curdData[index] = {
		...curdData[index],
		...data,
		updatedAt: faker.date.anytime(),
	};
	return HttpResponse.json({
		status: ResultStatus.SUCCESS,
		message: "update success",
		data: curdData.find((item) => item.id === id),
	});
});

const curdDelete = http.delete("/api/curd/:id", ({ params }) => {
	const { id } = params;
	curdData = curdData.filter((item) => item.id !== id);
	return HttpResponse.json({
		status: ResultStatus.SUCCESS,
		message: "delete success",
	});
});

export { curdList, curdDetail, curdCreate, curdUpdate, curdDelete };
