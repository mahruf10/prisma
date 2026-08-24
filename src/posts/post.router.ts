import express from "express";
import { postController } from "./post.controler";
import { middleware, userRole } from "../middleWare/auth";

const postRouter=express.Router()

postRouter.post('/',middleware(userRole.user),postController.postUser)
postRouter.get('/',middleware(userRole.user),postController.getAllPost)
postRouter.get('/:id',middleware(userRole.user),postController.getOnePost)
export default postRouter