import { Hono } from "hono";
import { cors } from "hono/cors"
import { blogZod, blogUpdateZod } from "../middlewares/zodMiddleware";

import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";

import { blogMiddleware } from "../middlewares/blogMiddleware";
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
blogRouter.use(blogMiddleware);


blogRouter.use(async (c, next) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    (c as any).set('prisma', prisma);
    await next();

});

blogRouter.post('/', blogZod, async (c) => {
    try {
        const body = await c.req.json();
        const prisma = (c as any).get('prisma') as PrismaClient;
        const userPayload = await (c as any).get('payload');
        if (!userPayload || !userPayload.id) {
            return c.json({
                message: "User not authenticated or email missing"
            }, 401);
        }
        const userId = c.get('userId');

        const post = await prisma.post.create({
            data: {
                title: body.title,
                content: body.content,
                authorId: userId
            }
        });
        console.log("post created successfully")
        return c.json({
            post
        }, 200);
    } catch (e) {
        console.error(e);
        return c.json({
            message: "Something went wrong"
        }, 500); 
    }
});


blogRouter.put('/', blogUpdateZod, async (c) => {
	const userId = c.get('userId');
	const prisma = await (c as any).get('prisma') as PrismaClient;
	const body = await c.req.json();
	const post = await prisma.post.update({
		where: {
			id: body.id,
			authorId: userId
		},
		data: {
			title: body.title,
			content: body.content
		}
	});
    console.log("updated post")
	return c.json(post);
});

blogRouter.get('/:id', async (c) => {
    const id = c.req.param('id');
	const prisma = (c as any).get('prisma') as PrismaClient;
	const post = await prisma.post.findUnique({
		where: {
			id
		}
	});

	return c.json(post);
})

blogRouter.get('/bulk', async (c) => {
    const userId = c.get('userId');
    const prisma  = (c as any).get('prisma') as PrismaClient;
    const posts = await prisma.post.findMany({
		where: {
			authorId : userId
		}
	});
    return c.json({
        posts
    })
})