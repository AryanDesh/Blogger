import { createMiddleware } from "hono/factory";
import { verify } from "hono/jwt";

export const blogMiddleware = createMiddleware(async(c, next) => {
   try{
       const header = c.req.header('Authorization') || "";
    //    const token = header.split("")[1];
       const ver = await verify(header, c.env.JWT_SECRET);   
       await next();
   }
   catch(e) {
    console.log(e);
    c.json({
        message : "User not found"
    }, 401)
   }
})
