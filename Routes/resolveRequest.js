const express=require('express');
const router=express.Router()
// const crypto= require('crypto');
// const findFunction=require('../Database/find')
const mongo=require('../Database/mongo')
require('dotenv').config()
let database = process.env.database;
const sql=require('../Database/sql');
router.post('/',async (req,res)=>{
    console.log("In resolve request endpoint")
    console.log(req.body);
    console.log(req.body.id);
  //  await mongo.updateOrders("id",req.body.id,"status",1,"productId",req.body.productId);
  if(database == 'sql'){
    await sql.updateOrders("id",req.body.id,"status",1,"productId",req.body.productId);
  }
  else {
    await mongo.updateOrders("id",req.body.id,"status",1,"productId",req.body.productId);
  }
    // await Order.updateOne({id:req.body.id},{status:1});
    res.end('success')
})

module.exports=router