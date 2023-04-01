const express=require('express');
const router=express.Router()
const confirmMail=require('../middlewares/confirmMail')
//const findFunction=require('../Database/find')
const mongo=require('../Database/mongo')
const sql=require('../Database/sql');
require('dotenv').config();
let database = process.env.database;
//const updateFunction=require('../Database/update')
router.post('/',async (req,res)=>{
   
   // let obj= await mongo.findUser("username",req.session.username);
   let obj;
   if(database == 'sql'){
       obj= await sql.findUser("username",req.session.username);
   }
   else {
    obj = await mongo.findUser("username",req.session.username);
   }
    // let obj=await findFunction("username",req.session.username);

            if(obj.length!=0){
                // obj[0].password=req.body.first;
                if(database == 'sql'){
                    await sql.updateUser("username",req.session.username,"password",req.body.first);
                }
                else {
                    await mongo.updateUser("username",req.session.username,"password",req.body.first)
                }
                // await updateFunction("username",req.session.username,"password",req.body.first);
                     
                    let email=obj[0].email;
                    confirmMail(req,res,email);
                    res.end("Password Update successfully");      
                }
            
            else {
                        res.end("Some error occur while changing the password")   
                 }
        
     })

module.exports=router