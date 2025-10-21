// routes/review-route.ts

import { Hono } from "hono";
import { handleCreateReview } from "../handlers/review-handler";
import authMiddleware from "../middlewares/auth";

const reviewRoutes = new Hono() //
	.use(authMiddleware())
	.post("/create", handleCreateReview);

export default reviewRoutes;
export type AppType = typeof reviewRoutes;
