const express=require('express');
const router=express.Router()
const findFunction=require('../Database/find')
const updateFunction =require('../Database/update')
const mongo=require('../Database/mongo')
router.get('/:token',async (req,res)=>{
    const {token}=req.params;
    console.log("printing token");
    console.log(token);
    let obj=await mongo.findUser("token",token);
    // let obj= await findFunction("token",token);
    if(obj.length==0){
        res.end("Fail to verify");

    }
    else {
        await mongo.updateUser("token",token,"isVerified",true);
        // await updateFunction("token",token,"isVerified",true);
        res.end("You are verified now");
        return;
    }
})
module.exports=router