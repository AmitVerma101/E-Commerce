const express=require('express');
const router=express.Router()
const crypto= require('crypto');
const findFunction=require('../Database/find')
const mongo=require('../Database/mongo')
router.post('/',async (req,res)=>{
    console.log(req.body.id);
    await mongo.updateOrders("id",req.body.id,"status",1);
    // await Order.updateOne({id:req.body.id},{status:1});
    res.end('success')
})

module.exports=router