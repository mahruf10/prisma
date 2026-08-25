import { error } from "node:console"
import { Post, postStatus } from "../../generated/prisma/client"
import { SortOrder } from "../../generated/prisma/internal/prismaNamespace"
import { prisma } from "../lib/prisma"
import { userRole } from "../middleWare/auth"

const createPost=async(data:Omit<Post,'id'| 'createdAt'| 'updatedAt'| 'authorId'>,userId:string)=>{
    const result=await prisma.post.create({
        data:{
            ...data,
            authorId:userId
        }
    }) 
    return result
}
    const getAllPosts=async(payload:{search:string | undefined,limit:number,page:number,skip:number,sortBy:string | undefined,sortOrder:string | undefined})=>{
    const search = payload.search?.trim();
    const result=await prisma.post.findMany({
        take:payload.limit,
        skip:payload.skip,
        orderBy:
            payload.sortBy && payload.sortOrder
                ? { [payload.sortBy]: payload.sortOrder as SortOrder }
                : { createdAt: 'desc' },
        
        ...(search ? {
            where: {
                OR:[
                    {
                        authorId:{
                           contains:search,
                           mode:'insensitive'
                        }
                    },{
                        tags:{
                            has:search
                        }
                    }
                ]
            },
            
        } : {})
        
        
    })
    return result
}
const getOnePost=async(id:string)=>{
    
    return await prisma.$transaction(async(tx)=>{
         await tx.post.update({
        where:{
            id:id
        }, 
        data:{
            views:{
                increment:1
            }
        }
    })
    const result=await tx.post.findUnique({
        where:{
            id:id
        },
        include:{
            comments:{
               where:{
                parentId:null //null diye bujaisi first comment,jeita comments field a boshbe
               },
               include:{ //er pore reply dile oitar parent hobe main comment.

                replies:{//eita first a true deya chilo.ami second comment reply dekhar jonno er moddho abr inclue disi
                    include:{
                        replies:true // jodi eitar child reply dekhtam.taile true er jaygay abr include ditam.then porer reply te true
                    }
                },
                  
               
               }
            
            },
             _count:{
                    select:{comments:true}
                }
        }
         
    })
    
    return result
    })
  
}
const myPost=async(authorId:string)=>{
    const isPostExits=await prisma.post.findMany({
        where:{
            authorId
        }
      
    })  
    if(!isPostExits){
     throw new Error('there is no post for this author')
    }
   
    return isPostExits

}
const updateMypost=async(authorId:string,data:Partial<Post>,postId:string,isAdmin:boolean)=>{
const isPostExits=await prisma.post.findUniqueOrThrow({
        where:{
            id:postId
        }
      
    })  
    if((isPostExits.authorId!==authorId) && !isAdmin){
        throw new Error('You are unable to edit this post')
    }
    if(!isAdmin){
        delete data.isFeatured
    }
    const result=await prisma.post.update({
        where:{
            id:postId
        },
        data
            
    })
    return result
}
const deletePost=async(authorId:string,postId:string,isAdmin:boolean)=>{
const isPostExits=await prisma.post.findUniqueOrThrow({
        where:{
            id:postId
        }
      
    })  
    if((isPostExits.authorId!==authorId) && !isAdmin){
        throw new Error('You are unable to edit this post')
    }
   
    const result=await prisma.post.delete({
        where:{
            id:postId
        }
        
    })
    return result
}
const adminStats=async()=>{
const totalPosts=await prisma.post.count()
const totalComments=await prisma.comment.count()
const totalUsers=await prisma.user.count()
const totalAdmin=await prisma.user.aggregate({
    where:{
     role:userRole.admin
    },
    _count:true
})
const totalDrafts=await prisma.post.count({
    where:{
        status:postStatus.DRAFT
    }
})
const totalPublished=await prisma.post.count({
    where:{
        status:postStatus.PUBLISHED
    }
})
const totalArchived=await prisma.post.count({
    where:{
        status:postStatus.ARCHIVED
    }
})
const pendingComments=await prisma.comment.count({
    where:{
        status:'PENDING'
    }
})
 return {
    totalAdmin:totalAdmin._count,
    totalArchived,
    totalComments,
    totalDrafts,
    totalUsers,
    totalPosts,
    totalPublished,
    pendingComments
 }
}
export const postService={
    createPost,
    getAllPosts,
    getOnePost,
    adminStats,
    myPost,
    updateMypost,
    deletePost
}