import express from 'express'
import postRouter from './posts/post.router'
import { auth } from './lib/auth'
import { toNodeHandler } from 'better-auth/node'
import cors from 'cors'
import commentRouter from './Comments/comment.router'
const app=express()
app.use(cors({
    origin:process.env.APP_URL || 'http://localhost:4000',
    credentials:true,
}))
app.use(express.json())
app.get('/',(req,res)=>{
    res.send('Hello World')
})
app.all("/api/auth/*splat", toNodeHandler(auth));
app.use('/posts',postRouter)
app.use("/comment",commentRouter)

export default app