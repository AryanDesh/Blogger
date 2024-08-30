import { z } from 'zod';
import { createMiddleware } from 'hono/factory';

const UserSchema = z.object({
    username: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
});

const ZodMiddleware = createMiddleware(async (c, next) => {
    try {
        const userData = await c.req.json();
        UserSchema.parse(userData);
        c.json = userData;
        await next();
    } catch (error) {
        if (error instanceof z.ZodError) {
            return c.json({ error: error.errors }, 400);
        }
        return c.json({ error: 'Internal server error' }, 500);
    }
});

export default ZodMiddleware;
