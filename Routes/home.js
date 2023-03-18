const express=require('express');
const router=express.Router()
const findFunction=require('../Database/find')

router.get('/',async (req,res)=>{
    console.log(req.session.username)
    if(req.session.username==undefined){
        res.render("home");
    }
    else {
     let value=await findFunction("username",req.session.username)
     value=value[0].isVerified
    if(req.session.isLoggedIn==true&&value){
        res.redirect("/products");
    }
    else { 
       res.render("home");
    }
}
})

module.exports=router