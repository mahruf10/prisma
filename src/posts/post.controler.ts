import { Request,Response } from "express";
import { postService } from "./post.service";

const postUser=async(req:Request,res:Response)=>{
   
    const userId=req.user?.id
    
    if(!userId){
        return res.status(401).json({message:'Unauthorized'})
    }
    try {
        const result=await postService.createPost(req.body,userId)
        res.status(200).json({
            success:true,
            message:'post is created',
            data:result
        })
    } catch (error:any) {
        res.status(500).json({
            success:false,
            message:'post could not be created...',
            details:error.message
        })
    }
}

const getAllPost=async(req:Request,res:Response)=>{
    const {search} = req.query
    const {page,limit} = req.query
    const skip=(Number(page)-1)*Number(limit)
    const sortBy=req.query.sortBy as string | undefined
    const sortOrder=req.query.sortOrder as string | undefined

    try {
        const searchString=typeof search === 'string' ? search : undefined;
        const result=await postService.getAllPosts({search:searchString,limit:Number(limit),page:Number(page),skip:Number(skip),sortBy,sortOrder})
        res.status(200).json({
            success:true,
            message:'posts are fetched',
            data:result
        })
    } catch (error:any) {
        res.status(500).json({
            success:false,
            message:'posts could not be fetched...',
            details:error.message
        })
    }
}

const getOnePost=async(req:Request,res:Response)=>{
  const {id}=req.params
  
  try{
    const result=await postService.getOnePost(id as string)
    res.status(200).json({
        success:true,
        message:'post is fetched',
        data:result
    })
  }
  catch(error:any){
    console.log(error);
    res.status(500).json({
        success:false,
        message:'post could not be fetched...',
        details:error.message
    })
  }
}
export const postController={
    postUser,
    getAllPost,
    getOnePost
}