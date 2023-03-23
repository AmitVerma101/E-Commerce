const express=require('express');
const router=express.Router()
const findFunction=require('../Database/find')
const updateFunction=require('../Database/update')
let mongo=require('../Database/mongo')
router.post('/',async (req,res)=>{
    console.log("In the incCount End Point");
    //console.log(req.body);
    if(req.session.username==undefined){
        res.render("login",{error:'Login First'});
    }
    else {
        let obj=await mongo.findUser("username",req.session.username)
        // let obj= await findFunction("username",req.session.username);
       
            let ans;
              for(let i=0;i<obj[0].products.length;i++){
                    if(obj[0].products[i].pId==req.body.id){
                        obj[0].products.splice(i,1);
                       
                    }
                }
                let arr=obj[0].products;
                console.log(arr);
                await mongo.updateUser("username",req.session.username,"products",arr);
                // await updateFunction("username",req.session.username,"products",arr);
              
                console.log("success");
                res.end("success")
         }
})

module.exports=router