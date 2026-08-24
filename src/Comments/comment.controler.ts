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
const getAllComments=async(req:Request,res:Response)=>{
const result=await commentService.getAllComments()
res.send(result)
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
const deleteComment=async(req:Request,res:Response)=>{
    const cmntId=req.params
    const id=req.user
 const result=await commentService.deleteComment(cmntId.id as string,id?.id as string)
 res.send(result)
}
const updateComment=async(req:Request,res:Response)=>{
const {id}=req.params
try {
    const result=await commentService.updateComment(id as string,req.body,req.user?.id as string)
    res.status(200).send({
        success:true,
        message:"data is updated.....",
        data:result
    })
} catch (error:any) {
    res.send({
        success:false,
        message:error.message
    })
}


}
const modarate=async(req:Request,res:Response)=>{
const {id}=req.params
try {
    const result=await commentService.modarate(id as string,req.body)
    res.send({
        success:true,
        message:result
    })
} catch (error:any) {
    res.send({
        success:false,
        message:error.message
    })
}
}
export const commentController={
    postComment,
    getAllComments,
    getOneComment,
    getCommentByAuthor,
    deleteComment,
    updateComment,
    modarate

}