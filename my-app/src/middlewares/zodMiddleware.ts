import { z } from 'zod';
import { createMiddleware } from 'hono/factory';

const UserSignupSchema = z.object({
    username: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
});

const UserSigninSchema = z.object({
    username: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
});

const BlogSchema = z.object({
    title: z.string(),
    content: z.string(),
});

const BlogUpdateSchema = z.object({
    title: z.string(),
    content: z.string(),
    id : z.string() || z.number()
});


type UserSignupData = z.infer<typeof UserSignupSchema>;
type UserSigninData = z.infer<typeof UserSigninSchema>;
type BlogData = z.infer<typeof BlogSchema>;
type BlogUpdateData = z.infer<typeof BlogUpdateSchema>;

const createZodMiddleware = <T>(schema: z.ZodSchema<T>) => {
    return createMiddleware(async (c, next) => {
        try {
            const data = await c.req.json();
            schema.parse(data);
            await next();
        } catch (error) {
            if (error instanceof z.ZodError) {
                return c.json({ error: error.errors }, 400);
            }
            return c.json({ error: 'Internal server error' }, 500);
        }
    });
};

export const userSignupZod = createZodMiddleware(UserSignupSchema);
export const userSigninZod = createZodMiddleware(UserSigninSchema);
export const blogZod = createZodMiddleware(BlogSchema);
export const blogUpdateZod = createZodMiddleware(BlogUpdateSchema);

