import { defineConfig } from "@rcmade/hono-docs";

export default defineConfig({
	tsConfigPath: "./tsconfig.json",
	openApi: {
		openapi: "3.0.0",
		info: { title: "WeTeller api", version: "1.0.0" },
		servers: [{ url: "http://localhost:3000/api" }],
	},
	outputs: {
		openApiJson: "./openapi/openapi.json",
	},
	apis: [
		{
			name: "Review Routes",
			apiPrefix: "api/v1/review", // This will be prepended to all `api` values below
			appTypePath: "./src/routes/review-route.ts", // Path to your AppType export
		},
	],
});
