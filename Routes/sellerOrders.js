const express=require('express');
const router=express.Router()
//const crypto= require('crypto');
//const findFunction=require('../Database/find')
const mongo=require('../Database/mongo')
const sql=require('../Database/sql');
require('dotenv').config()
let database = process.env.database;
router.get('/',async (req,res)=>{
  
  //  let order= await mongo.findOrders("sellerName",req.session.username,"status",0);
  let order;
  if(database == 'sql'){
    order= await sql.findOrders("sellerName",req.session.username,"status",0);
  }
  else {
    order = await mongo.findOrders("sellerName",req.session.username,"status",0);
  }
   
    console.log(order)
    console.log("Printing the value of order2")
  //  console.log(order2);
    let array=[]
    for(let i=0;i<order.length;i++){
      //  let product = await mongo.findProduct(0,1000,"id",order[i].productId);
      let product;
      if(database == 'sql'){
         product = await sql.findProduct(0,1000,"id",order[i].productId);

      }
      else {
        product = await mongo.findProduct(0,1000,"id",order[i].productId);
      }
        array.push(product[0]);
    }
    console.log("In the seller orders function");
    console.log(order);
    console.log(array);
  
    res.render('sellerOrders',{products:array,arr:order,username:req.session.username})
  
})

module.exports=router