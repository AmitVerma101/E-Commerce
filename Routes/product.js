const User=require('../userSchema');
//const findFunction=require('../Database/find')
const mongo= require('../Database/mongo')
const sql=require('../Database/sql');
// const sendMail=require('../middlewares/sendMail')
require('dotenv').config();
let database = process.env.database;
const express=require('express');
const router=express.Router()

router.get('/',async(req,res)=>{
    if(req.session.username==undefined){
        res.render("login",{error:"Login First to fetch the products Page"});
    }
    else{
      //  let obj= await mongo.findUser("username",req.session.username)
      let obj;
      if(database == 'sql'){
          obj=await sql.findUser("username",req.session.username);
      }
      else {
        obj = await mongo.findUser("username",req.session.username);
      }
        console.log("Printing in the products endpoint")
      //  console.log(obj2);
        // let obj= await findFunction("username",req.session.username)
        obj=obj[0].isVerified;
    
    if(req.session.isLoggedIn==true&&obj){
        req.session.products=-1;
            res.render("products",{username:req.session.username});
    }
    else{
        res.render("login",{error:'Verify using mail'});
    }
}
})
module.exports=router