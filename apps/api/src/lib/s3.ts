import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

type S3Body = Buffer | Uint8Array | Blob | File | string;

export const Buckets = {
	PUBLIC: process.env.AWS_S3_BUCKET!,
	PRIVATE: process.env.AWS_S3_BUCKET!,
} as const;
export type BucketName = (typeof Buckets)[keyof typeof Buckets];

export const s3 = new S3Client({
	region: process.env.AWS_REGION,
});

export async function uploadObject({ Bucket, Key, Body, ContentType }: { Bucket: BucketName; Key: string; Body: S3Body; ContentType: string }) {
	const { Body: normalized, ContentLength } = await normalizeBody(Body);
	const cmd = new PutObjectCommand({ Bucket, Key, Body: normalized, ContentType, ContentLength });
	const res = await s3.send(cmd);
	return res;
}

export async function deleteObject({ Bucket, Key }: { Bucket: BucketName; Key: string }) {
	const cmd = new DeleteObjectCommand({ Bucket, Key });
	return s3.send(cmd);
}

export const getObjectUrl = (Bucket: BucketName, Key: string) => {
	return `https://${Bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${Key}`;
};

export const signObjectUrl = async (Bucket: BucketName, Key: string, expiresIn = 60): Promise<string> => {
	if (!Bucket) throw new Error("Bucket name is required");
	if (!Key) throw new Error("Key is required");

	const command = new GetObjectCommand({ Bucket, Key });
	const url = await getSignedUrl(s3, command, { expiresIn });
	return url;
};

async function normalizeBody(body: S3Body) {
	if (typeof body === "string") {
		return { Body: body, ContentLength: Buffer.byteLength(body) };
	}
	// Node 18+/Next/Bun: File extends Blob
	if (body instanceof Blob) {
		const ab = await body.arrayBuffer();
		const buf = Buffer.from(ab);
		return { Body: buf, ContentLength: buf.byteLength };
	}
	// Buffer / Uint8Array are fine as-is
	if (body instanceof Uint8Array) {
		return { Body: body, ContentLength: body.byteLength };
	}
	throw new Error("Unsupported Body type");
}
