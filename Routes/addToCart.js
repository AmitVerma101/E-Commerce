const express=require('express');
const router=express.Router()
const findFunction=require('../Database/find')
const updateFunction=require('../Database/updateProduct')

router.post('/',async (req,res)=>{
    if(req.session.id==undefined){
        res.end("Not authorized");
    }
    else {
        let id=JSON.parse(req.body.id)
        let data= await findFunction("username",req.session.username)   
        if(data.length!=0){
            let x;
            for(let j=0;j<data[0].products.length;j++){
                if(data[0].products[j].pId==id){
                    x=1;
                }
            }
            if(x==undefined){
                await updateFunction("username",req.session.username,id)
                    console.log("Successfully updated");
                }
            }
        }
    
})

module.exports=router