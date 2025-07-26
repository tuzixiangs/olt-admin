import { http, HttpResponse } from "msw";

export const upload = http.post("/api/upload", async ({ request }) => {
	const formData = await request.formData();
	const file = formData.get("file") as File;
	await new Promise((resolve) => setTimeout(resolve, 1000 * 3));
	console.log("[ file ] >", file);
	return HttpResponse.json({
		url: URL.createObjectURL(file),
		name: file?.name,
		uid: file?.name,
		status: "done",
		percent: 100,
		type: file?.type,
		size: file?.size,
	});
});
