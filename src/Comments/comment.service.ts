import { prisma } from "../lib/prisma"


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

const getAllComments=()=>{

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
        }
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
export const commentService={
    postComment,
    getAllComments,
    getOneComment,
    getCommentByAuthor
}