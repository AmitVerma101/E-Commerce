const express=require('express');
const router=express.Router()
const crypto= require('crypto');
const findFunction=require('../Database/find')
const mongo=require('../Database/mongo')
router.get('/',async (req,res)=>{

    let order= await mongo.findOrders("sellerName",req.session.username,"status",0);
   
    console.log(order)
    let array=[]
    for(let i=0;i<order.length;i++){
        let product = await mongo.findProduct(0,1000,"id",order[i].productId);
        
        array.push(product[0]);
    }

    res.render('sellerOrders',{products:array,arr:order,username:req.session.username})
  
})

module.exports=router