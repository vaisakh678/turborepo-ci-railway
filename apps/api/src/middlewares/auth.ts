import { createMiddleware } from "hono/factory";
import { auth } from "../lib/auth";

const authMiddleware = () => {
	return createMiddleware(async (c, next) => {
		const session = await auth.api.getSession({ headers: c.req.raw.headers });
		if (!session || !session.user) {
			return c.text("Unauthorized", 401);
		}

		c.set("user", session.user);
		c.set("session", session);

		return next();
	});
};

export default authMiddleware;
