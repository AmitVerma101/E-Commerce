const express=require('express');
const router=express.Router()
// const findFunction=require('../Database/find')
// const updateFunction=require('../Database/update')
require('dotenv').config();
let database = process.env.database;
let mongo=require('../Database/mongo');
let sql=require('../Database/sql');
router.post('/',async (req,res)=>{
    console.log("In the incCount End Point");
    //console.log(req.body);
    if(req.session.username==undefined){
        res.render("login",{error:'Login First'});
    }
    else {
       // let obj=await mongo.findUser("username",req.session.username)
        // let obj= await findFunction("username",req.session.username);
       
          //  let ans;
            //   for(let i=0;i<obj[0].products.length;i++){
            //         if(obj[0].products[i].pId==req.body.id){
            //             obj[0].products.splice(i,1);
                       
            //         }
            //     }
                // let arr=obj[0].products;
                // console.log(arr);
                // await mongo.updateUser("username",req.session.username,"products",arr);
                if(database == 'sql'){
                  await sql.deleteFromCart("username",req.session.username,"id",req.body.id,req.body.orderStatus);
                }
                else {
                  await mongo.deleteFromCart("username",req.session.username,"id",req.body.id,req.body.orderStatus);
                }
                // await updateFunction("username",req.session.username,"products",arr);
              
                console.log("success");
                res.end("success")
         }
})

module.exports=router