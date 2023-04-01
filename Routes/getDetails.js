const express=require('express');
const router=express.Router()
const findFunction=require('../Database/findProduct')
const mongo=require('../Database/mongo')
const sql=require('../Database/sql');
require('dotenv').config()
let database = process.env.database;
router.post('/',async (req,res)=>{
    console.log("In the getDetails endpoint");
    console.log(req.session.username)
    if(req.session.username==undefined){
        res.render("home");
    }
    else {
     //   let obj= await mongo.findProduct(0,1,"id",req.body.id);
     let obj;
     if(database == 'sql'){
         obj=await sql.findProduct(0,1,"id",req.body.id);
     }
     else {
        obj = await mongo.findProduct(0,1,"id",req.body.id);
     }
        console.log("printing the value of obj in the getDetails endpoint ",obj);
        // let obj=findFunction(0,1,"id",req.body.id);
       
            res.json(obj[0]);
        }
})
module.exports=router