const express=require('express');
const router=express.Router()
const findFunction=require('../Database/find')
const updateFunction =require('../Database/update')

router.get('/:token',async (req,res)=>{
    const {token}=req.params;
    console.log("printing token");
    console.log(token);

    let obj= await findFunction("token",token);
    if(obj.length==0){
        res.end("Fail to verify");

    }
    else {
        await updateFunction("token",token,"isVerified",true);
        res.end("You are verified now");
        return;
    }
})
module.exports=router