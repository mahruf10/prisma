import { NextFunction,Request,Response } from "express"
import { auth } from "../lib/auth"

declare global{
    namespace Express{
        interface Request{
            user?:{
                id:string,
                email:string,
                role:string,
                name:string,
                emailVerified:boolean,
                
            }
        }
    }
}
export enum userRole{
admin='ADMIN',
user='USER'
}
export const middleware=(...roles:userRole[])=>{
    return async (req:Request,res:Response,next:NextFunction)=>{
        
      try {
          const session=await auth.api.getSession({
            headers:req.headers as any,
            
        })
        if(!session?.user){
            return res.status(401).json({message:'Unauthorized'})
        }
        if(!session.user.emailVerified){
            return res.status(403).json({message:'Email not verified'})
        }
        req.user={
            id:session.user.id,
            email:session.user.email, 
            role:session.user.role as userRole,
            name:session.user.name,
            emailVerified:session.user.emailVerified
        }
        if(roles.length && !roles.includes(session.user.role as userRole)){
            return res.status(403).json({message:'Forbidden,Insufficient role'})
        }
        next()
      } catch (error) {
        next(error)
      }
    }
}
