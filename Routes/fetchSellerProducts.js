const express=require('express');
const router=express.Router()
require('dotenv').config();
let database = process.env.database;
const mongo=require('../Database/mongo')
const sql=require('../Database/sql');
router.get('/',async (req,res)=>{
    console.log("In the fetchSellerProducts endpoint");
   // let obj= await mongo.findProduct(0,1000,"username",req.session.username);
   let obj;
   if(database ==  'sql'){
     obj= await sql.findProduct(0,1000,"username",req.session.username);
   }
   else {
    obj = await mongo.findProduct(0,1000,"username",req.session.username);
   }
    // let obj=await Product.find({username:req.session.username})
    console.log("consoling the value of obj2 ");
  //  console.log(obj2);
    console.log(obj);
     res.json(obj);
})

module.exports=router