import { Request, Response } from "express";

export const notFound=(req:Request,res:Response)=>{
    res.status(404).send({
        message:'Could not found this page.......',
        path:req.originalUrl
    })
}