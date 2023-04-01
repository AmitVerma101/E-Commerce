const express=require('express');
const router=express.Router()
//const findFunction=require('../Database/find')
const mongo=require('../Database/mongo')
const sql=require('../Database/sql');
require('dotenv').config()
let database = process.env.database;
router.get('/',async (req,res)=>{
    if(req.session.isLoggedIn==true){
        res.render("sellerProducts",{username:req.session.username});
        return;
    }
    res.render("sellerLogin",{error:''})
})
router.post('/',async (req,res)=>{
    if(req.session.isLoggedIn==true){
        res.render('sellerProducts',{username:req.session.username});
        return;
    }
// let obj= await mongo.findSeller("username",req.body.username,"password",req.body.password);
let obj;
if(database == 'sql'){
    obj=await sql.findSeller("username",req.body.username,"password",req.body.password);
}
else {
    obj=await mongo.findSeller("username",req.body.username,"password",req.body.password);
}
 console.log("printing the value of obj2 in the sellerLogin endPoint");
 console.log(obj);
     if(obj.length==1){
        req.session.isLoggedIn=true;
        req.session.username=req.body.username;
        res.render("sellerProducts",{username:req.session.username});
     }
     else {
        res.render('sellerLogin',{error:'Wrong username or password'});
     }
})

module.exports=router