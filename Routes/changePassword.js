const express=require('express');
const router=express.Router()
const findFunction=require('../Database/find')

router.get('/',async (req,res)=>{

    if(req.session.username==undefined){
        res.render("login",{error:'Login First'})
    }
    else {
        let obj=await findFunction("username",req.session.username)
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