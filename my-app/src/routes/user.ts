import { Hono } from 'hono';
import { jwt , sign } from 'hono/jwt'

import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";


import ZodMiddleware from '../middlewares/zodMiddleware';
import { cors } from 'hono/cors';

type Bindings = {
    DATABASE_URL : string;
    JWT_SECRET : string;
}

export const userRouter =  new Hono<{
    Bindings: Bindings
}>() ;

userRouter.use(cors());

userRouter.post('/signup', ZodMiddleware, async(c) => {
    try{
        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL,
        }).$extends(withAccelerate());
        
        const body = await c.req.json();
        
        const user = await prisma.user.create({
          data: {
            email: body.email,
            password: body.password,
          },
        });
      
        const token = await sign({ id: user.id }, c.env.JWT_SECRET)
      
        return c.json({
          jwt: token
        })
    }
    catch (error){
        console.log(error);
        return c.json({
            error : error
        }, 500)
    }
})

userRouter.post('/signin', ZodMiddleware , async(c) => {
    try{
        const prisma = new PrismaClient({
            datasourceUrl : c.env.DATABASE_URL,
        }).$extends(withAccelerate());
        
        const body = await c.req.json();
    
        const user = await prisma.user.findUnique({
            where: {
                email: body.email,
        password: body.password
            }
        });
    
        if(!user) {
            return c.json({ error: "user not found" }, 403);
        }
        
        const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);
        return c.json({ jwt });

    }
    catch(error){
        return c.json({
            error : error
        }, 500)
    }
})

