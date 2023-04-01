const express=require('express');
const router=express.Router()
const crypto= require('crypto');
const findFunction=require('../Database/find')
const mongo=require('../Database/mongo')
const sql=require('../Database/sql')
require('dotenv').config()
let database = process.env.database;
router.post('/',async (req,res)=>{
    console.log(req.body.id);
    if(database == 'sql'){
        await sql.updateOrders("id",req.body.id,"status",-1,"p_id",req.body.productId);
    }
    else {
        await mongo.updateOrders("id",req.body.id,"status",-1,"p_id",req.body.productId);
    }
    // await Order.updateOne({id:req.body.id},{status:1});
    res.end('success')
})

module.exports=router