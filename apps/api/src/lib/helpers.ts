import { db, FileSchema } from "@repo/db";
import { eq } from "drizzle-orm";
import { uploadObject } from "./s3";

export async function uploadFile(file: File) {
	const newName = `${crypto.randomUUID()}-${file.name}`;
	const uri = `/uploads/${newName}`;

	const [{ id }] = await db
		.insert(FileSchema)
		.values({
			name: newName,
			size: file.size.toString(),
			mimeType: file.type,
			uri: uri,
			status: "pending",
		})
		.returning({ id: FileSchema.id });

	if (!id) throw new Error("Failed to create file record");

	await uploadObject({
		Body: file,
		Bucket: "PUBLIC",
		ContentType: file.type,
		Key: uri,
	});

	await db.update(FileSchema).set({ status: "completed" }).where(eq(FileSchema.id, id));

	return {
		uri,
		fileId: id,
	};
}
