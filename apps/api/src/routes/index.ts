import { Hono } from "hono";
import reviewRoutes from "./review-route";
import docs from "./docs";

const apiRoutes = new Hono() //
	.route("/docs", docs)
	.route("/review", reviewRoutes);

export default apiRoutes;
export type AppType = typeof apiRoutes;
