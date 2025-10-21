import { ApiError } from "../lib/errors";
import { HTTPResponseError } from "hono/types";
import { Context } from "hono";
import { AppType } from "../lib/types";
import { APIResponse } from "@repo/types";
import { ZodError } from "zod";

const globalCatch = (err: Error | HTTPResponseError, c: Context<AppType>) => {
	if (err instanceof ApiError) {
		return c.json<APIResponse>({ error: err.message }, err.statusCode);
	}

	if (err instanceof ZodError) {
		const formattedErrors: Record<string, string> = {};
		err.issues.forEach((issue) => {
			formattedErrors[issue.path.join(".")] = issue.message;
		});

		return c.json<APIResponse<null, Record<string, string>>>(
			{
				error: "Validation Error",
				errors: formattedErrors,
			},
			400
		);
	}

	console.trace("Unhandled Error:", err);
	return c.json<APIResponse>({ error: "Something went wrong" }, 500);
};

export default globalCatch;
