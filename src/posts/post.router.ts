import express from "express";
import { postController } from "./post.controler";
import { middleware, userRole } from "../middleWare/auth";

const postRouter=express.Router()

postRouter.post('/',middleware(userRole.user,userRole.admin),postController.postUser)
postRouter.get('/',middleware(userRole.user),postController.getAllPost)
postRouter.get('/adminstats',middleware(userRole.admin),postController.adminStats)
postRouter.get('/:id',middleware(userRole.user),postController.getOnePost)
postRouter.get('/author/:id',middleware(userRole.user,userRole.admin),postController.myPost)
postRouter.patch('/:id',middleware(userRole.user,userRole.admin),postController.updateMypost)
postRouter.delete('/:id',middleware(userRole.user,userRole.admin),postController.deletePost)

export default postRouter