import { prisma } from "../lib/prisma";
import { userRole } from "../middleWare/auth";

const seedAdmin=async()=>{
    try {
        const adminData={
            name:'admin saheb1',
            email:'admin@saheb1.com',
            password:'admin123',
            role:userRole.admin
        }
        const existEmail=await prisma.user.findUnique({
            where:{
                email:adminData.email
            }
        })
        if(existEmail){
          throw new Error("Admin already exists");
    } 
    const createAdmin=await fetch("http://localhost:3000/api/auth/sign-up/email",{
        method:'POST',
        headers:{
            "content-type":"application/json",
            origin:process.env.BETTER_AUTH_URL || 'http://localhost:3000'

        },
        body:JSON.stringify(adminData)
    })    
    console.log(createAdmin.status);
    const responseBody = await createAdmin.json().catch(() => null);

    if(!createAdmin.ok){
        throw new Error("Failed to create admin",responseBody);
    }
        await prisma.user.update({
            where:{
                email:adminData.email
            },
            data:{
                emailVerified:true
            }
        })
    
    console.log(createAdmin);
}
catch (error)
    {
   console.log(error);
    }

}
seedAdmin()