import { z } from 'zod';
import { createMiddleware } from 'hono/factory';
import { UserSigninSchema , UserSignupSchema ,BlogSchema ,BlogUpdateSchema} from '@aryandesh/blogger-zod';

const createZodMiddleware = <T>(schema: z.ZodSchema<T>) => {
    return createMiddleware(async (c, next) => {
        try {
            const data = await c.req.json();
            console.log('Received data:', data);

            schema.parse(data);
            await next();
        } catch (error) {
            return c.json({ error: error }, 500);
        }
    });
};

export const userSignupZod = createZodMiddleware(UserSignupSchema);
export const userSigninZod = createZodMiddleware(UserSigninSchema);
export const blogZod = createZodMiddleware(BlogSchema);
export const blogUpdateZod = createZodMiddleware(BlogUpdateSchema);
