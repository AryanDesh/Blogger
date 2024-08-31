import { createMiddleware } from "hono/factory";
import { verify, decode } from "hono/jwt";

export const blogMiddleware = createMiddleware(async (c, next) => {
    const authHeader = c.req.header('Authorization') || "";
    const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : "";

    if (!token) {
        c.status(401);
        return c.json({ error: "Authorization token is missing" });
    }

    try {
        const ver = await verify(token, c.env.JWT_SECRET);
        const { header, payload } = decode(token);

        if (ver.id) {
            (c as any).set('payload', payload);
            (c as any).set('header', header);
            await next();
        } else {
            c.status(403);
            return c.json({ error: "Unauthorized" });
        }
    } catch (e) {
        console.error("JWT verification failed:", e);
        c.status(401);
        return c.json({ error: "Invalid or expired token" });
    }
});

