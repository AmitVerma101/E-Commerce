const express=require('express');
const router=express.Router()
require('dotenv').config()
let database = process.env.database
// const findFunction=require('../Database/find')
// const updateFunction=require('../Database/update')
const mongo=require('../Database/mongo')
const sql=require('../Database/sql');
router.post('/',async (req,res)=>{
    console.log("In the incCount End Point");
    //console.log(req.body);
    if(req.session.username==undefined){
        res.render("login",{error:'Login First'});
    }
    else {
        // let obj=await mongo.findUser("username",req.session.username);
        // // let obj= await findFunction("username",req.session.username);
        // let ans;
        //   for(let i=0;i<obj[0].products.length;i++){
        //         if(obj[0].products[i].pId==req.body.id){
        //             ans=i;
        //             obj[0].products[i].quantity++;
        //         }
        //     }
        //     let arr=obj[0].products;
        //     console.log(arr);
          //  await mongo.updateUser("username",req.session.username,"products",arr);
          let value;
          if(database == 'sql'){
              value =  await sql.updateCart("username",req.session.username,"id",req.body.id,"incCount");
          }
          else {
            value = await mongo.updateCart("username",req.session.username,"id",req.body.id,"incCount");
          }
          console.log("consoling value in incCount",value);
            if(!value){
                res.end("failure");
            }
            else {
                res.end("success");

            }
            // await updateFunction("username",req.session.username,"products",arr);
    }
   
  
})

module.exports=router