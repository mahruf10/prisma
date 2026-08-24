import express from "express";
import {commentController}  from "../Comments/comment.controler";
import { middleware, userRole } from "../middleWare/auth";

const commentRouter=express.Router()

commentRouter.post('/',middleware(userRole.user),commentController.postComment)
commentRouter.get('/',middleware(userRole.user),commentController.getAllComments)
commentRouter.get('/:id',middleware(userRole.user),commentController.getOneComment)
commentRouter.get('/author/:id',middleware(userRole.user),commentController.getCommentByAuthor)
export default commentRouter