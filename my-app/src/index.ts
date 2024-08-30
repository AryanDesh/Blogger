import { Hono } from 'hono'
import { logger } from 'hono/logger'
import userRouter from './routes/user';


const app = new Hono()
app.route('', userRouter);

export default app
