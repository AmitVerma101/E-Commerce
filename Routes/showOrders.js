const express=require('express');
const router=express.Router()
const crypto= require('crypto');
//const findFunction=require('../Database/find')
const mongo=require('../Database/mongo')
const sql=require('../Database/sql');
require('dotenv').config()
let database = process.env.database;
async function getOrderInArray(orders){
    let array = [];
    for(let i = 0 ;i< orders.length;++i){
        console.log("here");
        let product;
      //  let product = await mongo.findProduct(0,1000,'id',orders[i].productId);
      if(database == 'sql'){
          product = await sql.findProduct(0,1000,'id',orders[i].productId);
      }
      else {
        product = await mongo.findProduct(0,1000,'id',orders[i].productId)
      }
         console.log(product[0]);
         array.push(product[0]);
    }
    return array;
}
router.get('/',async (req,res)=>{
    console.log("In the show orders function")
    console.log(req.session.username);
   //let orders= await mongo.findOrders("username",req.session.username);
   let orders;
   if(database == 'sql'){
       orders= await sql.findOrders("username",req.session.username);
   }
   else {
    orders = await mongo.findOrders("username",req.session.username);
   }
    console.log("printing the orders array");
    console.log(orders);
    let newArrFinal= await getOrderInArray(orders);
    console.log("printing the newArrFinal")
    console.log(newArrFinal);
    console.log("printing the orders array")
    console.log(orders)
    res.render("order",{products:newArrFinal,arr:orders,username:req.session.username})
})

module.exports=router