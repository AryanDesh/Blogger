import { Hono } from "hono";
import { cors } from "hono/cors"

type Bindings = {
    DATABASE_URL: string;
    JWT_SECRET: string;
}

export const blogRouter = new Hono<{
    Bindings: Bindings;
    Variables: {
        userId: string;
    }
}>();

blogRouter.use(cors());
blogRouter.post('/', async (c) => {
    console.log('Reached blogRouter POST handler'); // Logging to debug
    return c.newResponse("lets see if this works");
});
