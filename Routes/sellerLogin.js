const express=require('express');
const router=express.Router()
const findFunction=require('../Database/find')
const mongo=require('../Database/mongo')
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
 let obj= await mongo.findSeller("username",req.body.username,"password",req.body.password);
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