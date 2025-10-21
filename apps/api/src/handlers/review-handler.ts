import { Context } from "hono";
import { ReviewCreateInput } from "@repo/zod";
import { createReview } from "../services/review-service";
import { APIResponse } from "@repo/types";

export async function handleCreateReview(c: Context) {
	const userId = c.get("user")?.id;
	if (!userId) {
		return c.text("Unauthorized", 401);
	}

	const fd = await c.req.formData();
	const data = {
		name: fd.get("name"),
		phone: fd.get("phone"),
		email: fd.get("email"),
		address: fd.get("address"),
		projectType: fd.get("projectType"),
		region: fd.get("region"),
		experience: fd.get("experience"),
		tags: fd.getAll("tags") as string[],
		note: fd.get("note"),
		attachments: fd.getAll("attachments") as File[],
	};

	const res = await createReview(userId, data as ReviewCreateInput);

	return c.json<APIResponse<typeof res>>({
		data: res,
		message: "Review created successfully",
	});
}
