import { z } from 'zod';
import { createMiddleware } from 'hono/factory';

const UserSchema = z.object({
    username: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
});

type zodSchema = z.infer<typeof UserSchema>
export const userZod = createMiddleware(async (c, next) => {
    try {
        const userData = await c.req.json();
        UserSchema.parse(userData);
        await next();
    } catch (error) {
        if (error instanceof z.ZodError) {
            return c.json({ error: error.errors }, 400);
        }
        return c.json({ error: 'Internal server error' }, 500);
    }
});

const BlogSchema = z.object({
    title: z.string(),
    content: z.string(),
});

type zodSchema2 = z.infer<typeof BlogSchema>

export const blogZod = createMiddleware(async (c, next) => {
    try {
        const blog = await c.req.json();
        BlogSchema.parse(blog);
        await next();
    } catch (error) {
        if (error instanceof z.ZodError) {
            return c.json({ error: error.errors }, 400);
        }
        return c.json({ error: 'Internal server error' }, 500);
    }
});

