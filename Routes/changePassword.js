const express=require('express');
const router=express.Router()
//const findFunction=require('../Database/find')
const mongo=require('../Database/mongo')
const sql=require('../Database/sql')
require('dotenv').config();
let database = process.env.database;
router.get('/',async (req,res)=>{

    if(req.session.username==undefined){
        res.render("login",{error:'Login First'})
    }
    else {
       // let obj= await mongo.findUser("username",req.session.username)
       let obj;
       if(database == 'sql'){
           obj=await sql.findUser("username",req.session.username);
       }
       else {
           obj = await mongo.findUser("username",req.session.username);
       }
      //  console.log(obj2);
        // let obj=await findFunction("username",req.session.username)
        obj=obj[0].isVerified;
        if(req.session.isLoggedIn&&obj){
            res.render("changePassword");
        }
        else {
            res.render("login",{error:"Verify Email first"});
        }
    }
})

module.exports=router