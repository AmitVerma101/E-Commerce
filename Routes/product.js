const User=require('../userSchema');
const findFunction=require('../Database/find')
// const sendMail=require('../middlewares/sendMail')

const express=require('express');
const router=express.Router()

router.get('/',async(req,res)=>{
    if(req.session.username==undefined){
        res.render("login",{error:"Login First to fetch the products Page"});
    }
    else{
        let obj= await findFunction("username",req.session.username)
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