import { serve } from "@hono/node-server";

import { Hono } from "hono";
import { cors } from "hono/cors";
import apiRoutes from "./routes";
import { logger } from "hono/logger";
import { auth } from "./lib/auth";
import { AppType } from "./lib/types";
import globalCatch from "./middlewares/global-catch";

const app = new Hono<AppType>();
app.use(logger());
app.use(cors({ origin: "*" }));

app.onError(globalCatch);

app.on(["POST", "GET"], "/api/auth/*", (c) => {
	return auth.handler(c.req.raw);
});

app.route("/api/v1", apiRoutes);

app.get("/", (c) => {
	return c.text("Hello Hono!");
});

app.get("/health", (c) => {
	return c.json({ status: "ok" });
});

// export default app;
serve({ fetch: app.fetch, port: 3000 });
