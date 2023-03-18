const express=require('express');
const router=express.Router()
const findFunction=require('../Database/findProduct')

router.get('/',async (req,res)=>{
    console.log(req.session.username)
    if(req.session.username==undefined){
        res.render("home");
    }
    else {
        let obj=findFunction(0,1,"id",req.body.id);
       
            res.json(obj[0]);
        }
})
module.exports=router