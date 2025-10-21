import { serve } from "bun";
import { Hono } from "hono";

const app = new Hono();

app.get("/", (c) => {
	return c.text("Hello Hono!");
});

serve({
	fetch: app.fetch,
	port: 3000,
});
