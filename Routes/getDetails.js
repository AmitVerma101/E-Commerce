const express=require('express');
const router=express.Router()
const findFunction=require('../Database/findProduct')
const mongo=require('../Database/mongo')
router.get('/',async (req,res)=>{
    console.log(req.session.username)
    if(req.session.username==undefined){
        res.render("home");
    }
    else {
        let obj= await mongo.findProduct(0,1,"id",req.body.id);
        // let obj=findFunction(0,1,"id",req.body.id);
       
            res.json(obj[0]);
        }
})
module.exports=router