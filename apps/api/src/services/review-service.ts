import { CustomerReviewSchema, CustomerSchema, db } from "@repo/db";
import { ReviewCreateInput, reviewCreateSchema } from "@repo/zod";
import { uploadFile } from "../lib/helpers";

export async function createReview(userId: string, body: ReviewCreateInput) {
	const data = reviewCreateSchema.parse(body);

	const files = await Promise.all((data.attachments ?? []).map((file) => uploadFile(file)));

	const [customer] = await db
		.insert(CustomerSchema)
		.values({
			userId,
			address: data.address,
			email: data.email,
			name: data.name,
			phone: data.phone,
			region: data.region,
		})
		.returning({ id: CustomerSchema.id });

	await db.insert(CustomerReviewSchema).values({
		userId,
		customerId: customer.id,
		experience: data.experience,
		note: data.note,
		projectType: data.projectType,
		tags: data.tags,
		attachments: files.map((file) => file.fileId),
	});

	return {};
}
