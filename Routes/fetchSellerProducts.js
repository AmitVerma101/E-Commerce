const express=require('express');
const router=express.Router()

const mongo=require('../Database/mongo')
router.get('/',async (req,res)=>{
    console.log("In the fetchSellerProducts endpoint");
    let obj= await mongo.findProduct(0,1000,"username",req.session.username);
    // let obj=await Product.find({username:req.session.username})
     res.json(obj);
})

module.exports=router