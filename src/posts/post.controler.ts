import { Request,Response } from "express";
import { postService } from "./post.service";
import { userRole } from "../middleWare/auth";

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
const myPost=async(req:Request,res:Response)=>{
try {
    const result=await postService.myPost(req.user?.id as string)
    res.status(200).send({
        succsess:true,
        data:result
    })
} catch (error:any) {
    res.send({
        success:false,
        message:error.message
    })
}
}
const updateMypost=async(req:Request,res:Response)=>{
 const data=req.body
 const{id}=req.params
 const isAdmin=req.user?.role===userRole.admin
 try {
    const result=await postService.updateMypost(req.user?.id as string,data,id as string,isAdmin)
    res.send({
        success:true,
        data:result
    })
 } catch (error:any) {
    res.status(400).send({
        success:false,
        message:error.message
    })
 }
}
const deletePost=async(req:Request,res:Response)=>{
 const{id}=req.params
 const isAdmin=req.user?.role===userRole.admin
 try {
    const result=await postService.deletePost(req.user?.id as string,id as string,isAdmin)
    res.send({
        success:true,
        data:result
    })
 } catch (error:any) {
    res.status(400).send({
        success:false,
        message:error.message
    })
 }
}
const adminStats=async(req:Request,res:Response)=>{
    console.log(req.user?.role);
    try {
        const result=await postService.adminStats()
        res.send({
            success:true,
            data:result
        })
    } catch (error:any) {
        res.send({
            success:false,
            message:error.message
        })
    }
}
export const postController={
    postUser,
    getAllPost,
    getOnePost,
    myPost,
    updateMypost,
    deletePost,
    adminStats
}