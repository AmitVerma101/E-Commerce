const express=require('express');
const router=express.Router()
require('dotenv').config();
let database = process.env.database;
// const findFunction=require('../Database/find')
// const updateFunction =require('../Database/update')

const mongo=require('../Database/mongo')
const sql=require('../Database/sql')
router.get('/:token',async (req,res)=>{
    const {token}=req.params;
    console.log("printing token");
    console.log(token);
    let obj;
    if(database == 'sql'){
        obj=await sql.findUser("token",token);
    }
    else {
        obj=await mongo.findUser("token",token);
    }
    // console.log("printing the value of obj2");
    // console.log(obj2);
    // let obj= await findFunction("token",token);
    if(obj.length==0){
        res.end("Fail to verify");

    }
    else {
        if(database == 'sql'){
            await sql.updateUser("token",token,"isVerified",1);
        }
        else {
            await mongo.updateUser("token",token,"isVerified",1);
        }
        // await updateFunction("token",token,"isVerified",true);
        res.end("You are verified now");
        return;
    }
})
module.exports=router