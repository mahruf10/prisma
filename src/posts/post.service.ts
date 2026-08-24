import { Post } from "../../generated/prisma/client"
import { SortOrder } from "../../generated/prisma/internal/prismaNamespace"
import { prisma } from "../lib/prisma"

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
export const postService={
    createPost,
    getAllPosts,
    getOnePost
}