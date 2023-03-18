const express=require('express');
const router=express.Router()
const confirmMail=require('../middlewares/confirmMail')
const findFunction=require('../Database/find')
const updateFunction=require('../Database/update')
router.post('/',async (req,res)=>{
   

    let obj=await findFunction("username",req.session.username);

            if(obj.length!=0){
                // obj[0].password=req.body.first;
                await updateFunction("username",req.session.username,"password",req.body.first);
                     
                    let email=obj[0].email;
                    confirmMail(req,res,email);
                    res.end("Password Update successfully");      
                }
            
            else {
                        res.end("Some error occur while changing the password")   
                 }
        
     })

module.exports=router