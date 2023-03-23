const express=require('express');
const router=express.Router()
const crypto= require('crypto');
const findFunction=require('../Database/find')
const mongo=require('../Database/mongo')
router.post('/',async (req,res)=>{
    console.log("In the place order end point")
        let {id,sellerName,quantity} = req.body;
        console.log(id,sellerName);
        await mongo.createOrder({id:crypto.randomBytes(3).toString('hex'),username:req.session.username,sellerName:sellerName,productId:id,status:0,quantity:quantity})
        

        res.end("order saved successfully");
})

module.exports=router