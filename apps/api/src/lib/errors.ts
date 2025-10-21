import { ContentfulStatusCode } from "hono/utils/http-status";

export class ApiError extends Error {
	statusCode: ContentfulStatusCode;
	code: string;
	details?: any;

	constructor(statusCode: ContentfulStatusCode, message: string, code = "INTERNAL_ERROR", details?: any) {
		super(message);
		this.statusCode = statusCode;
		this.code = code;
		this.details = details;
		Object.setPrototypeOf(this, new.target.prototype);
		Error.captureStackTrace(this, this.constructor);
	}
}

export const BadRequestError = (message = "Bad Request", details?: any) => new ApiError(400, message, "BAD_REQUEST", details);

export const UnauthorizedError = (message = "Unauthorized") => new ApiError(401, message, "UNAUTHORIZED");

export const ForbiddenError = (message = "Forbidden") => new ApiError(403, message, "FORBIDDEN");

export const NotFoundError = (message = "Resource Not Found") => new ApiError(404, message, "NOT_FOUND");

export const ConflictError = (message = "Conflict") => new ApiError(409, message, "CONFLICT");

export const ValidationError = (message = "Validation Failed", details?: any) => new ApiError(422, message, "VALIDATION_ERROR", details);

export const InternalServerError = (message = "Internal Server Error") => new ApiError(500, message, "INTERNAL_ERROR");
