import { error } from "node:console"
import { prisma } from "../lib/prisma"
import { commentStatus } from "../../generated/prisma/enums"


const postComment=async(payload:{content:string,authorId:string,postId:string,parentId?:string})=>{

    await prisma.post.findUniqueOrThrow({
        where:{
            id:payload.postId
        }
    })
if(payload.parentId){
       await prisma.comment.findUniqueOrThrow({
        where:{
            id:payload.parentId
        }
    })
}
 
const result=await prisma.comment.create({
    data: payload
})
return result
}

const getAllComments=async()=>{
const result=await prisma.comment.findMany()
return result
}
const getOneComment=async(id:string)=>{
return await prisma.comment.findUnique({
    where:{
        id
    },
    include:{
        post:{ // jodi ami post er sob data dekhatam taile post:true e rakhtam.
            // specific dekhabo dekhe select kore then jei field dekhabo oigula true disi
          select:{
            authorId:true,
            tags:true
          }
        },
        replies:true
            
        
    }
})
}
const getCommentByAuthor=async(authorId:string)=>{
return await prisma.comment.findMany({
    where:{
        authorId
    },
    orderBy:{
        createdAt:'desc'
    },
    include:{
        post:{
            select:{
                isFeatured:true
            }
        }
    }
})
}
const deleteComment=async(id:string,authorId:string)=>{
const findComment=await prisma.comment.findFirst({
    where:{
        id,
        authorId
    }
})
if(!findComment){
    throw new Error('you are unable to delete this comment')
}
return await prisma.comment.delete({
    where:{
        id:findComment.id
    }
})
}
const updateComment=async(Id:string,data:{content?:string,status?:commentStatus},authorId:string)=>{
const findComment=await prisma.comment.findFirst({
    where:{
        id:Id,
        authorId
    }
})
if(!findComment){
    throw new Error('you are unable to delete this comment')
}
return await prisma.comment.update({
    where:{
        id:Id
    },
    data
})
}
const modarate=async(id:string,data:{status:commentStatus})=>{

    const findComment=await prisma.comment.findUniqueOrThrow({
    where:{
        id
    }
})
if(!findComment){
    throw new Error('you are unable to delete this comment')
}
    if(data.status===findComment.status){
        return {message:'data is already updated...'}
    }
return await prisma.comment.update({
    where:
    {
        id
    },
    data
})
}
export const commentService={
    postComment,
    getAllComments,
    getOneComment,
    getCommentByAuthor,
    deleteComment,
    updateComment,
    modarate
}