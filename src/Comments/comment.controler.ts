import { Request,Response } from "express"

import { commentService } from "./comment.service"
import { success } from "better-auth"


const postComment=async(req:Request,res:Response)=>{
const commentData=req.body
try {
    const result=await commentService.postComment(commentData)
    res.status(200).send({
        success:true,
        data:result
    })
} catch (error) {
    res.status(403).send({
        success:false,
        message:error
    })
}
}
const getAllComments=()=>{

}
const getOneComment=async(req:Request,res:Response)=>{
const {id}=req.params
const result=await commentService.getOneComment(id as string)
res.send({
    success:true,
    data:result
})
}
const getCommentByAuthor=async(req:Request,res:Response)=>{
 const { authorId } = req.params
 try {
    const result=await commentService.getCommentByAuthor(authorId as string)
 res.send({
    message:'comments fetched for this author',
    data:result
 })
 } catch (error) {
    console.log(error);
 }
 
}
export const commentController={
    postComment,
    getAllComments,
    getOneComment,
    getCommentByAuthor

}