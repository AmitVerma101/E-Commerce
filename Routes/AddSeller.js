const express=require('express');
const sellerMail=require('../middlewares/sellerMail')
let crypto=require('crypto')
const router=express.Router()
const findFunction=require('../Database/find')
const mongo=require('../Database/mongo')
router.post('/',async (req,res)=>{
    if(req.session.username!='Admin'){
        res.end("You do not have the authorization to access the page");
    }
    else {
        let username="Seller"+crypto.randomBytes(4).toString('hex');
        let password=crypto.randomBytes(5).toString('hex');
        let val= {name:req.body.name,username:username,email:req.body.email,password:password};
        let seller= await mongo.createSeller(val);
       
             sellerMail(req,res,req.body.email,username,password);
             res.render("adminPanel",{error:'Saved Successfully'});

         
        
    }
})

module.exports=router