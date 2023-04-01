const express=require('express');
const router=express.Router()
const crypto= require('crypto');
//const findFunction=require('../Database/find')
const sql=require('../Database/sql');
const mongo=require('../Database/mongo')
require('dotenv').config();
let database = process.env.database;
router.post('/',async (req,res)=>{
    console.log("In the place order end point")
        let {id,sellerName,quantity,cost} = req.body;
        console.log("cost",cost);
        console.log(id,sellerName);
        if(database == 'sql'){
            await sql.createOrder({id:crypto.randomBytes(3).toString('hex'),username:req.session.username,sellerName:sellerName,productId:id,status:0,quantity:quantity,total:cost})
        }
        else {
            await mongo.createOrder({id:crypto.randomBytes(3).toString('hex'),username:req.session.username,sellerName:sellerName,productId:id,status:0,quantity:quantity,total:cost})
        }
        
        res.end("order saved successfully");
})

module.exports=router