const express=require('express');
const router=express.Router()
// const findFunction=require('../Database/find')
// const updateFunction=require('../Database/updateProduct')
const mongo=require('../Database/mongo')
const sql= require('../Database/sql');
require('dotenv').config();
let database = process.env.database;
router.post('/',async (req,res)=>{
    if(req.session.username==undefined){
        res.end("Not authorized");
    }
    else {
        let id=req.body.id
        // let data = await mongo.findUser("username",req.session.username);
        // let data2= await sql.findUser("username",req.session.username);
        // // let data= await findFunction("username",req.session.username)   
        // if(data.length!=0){
        //     let x;
        //     for(let j=0;j<data[0].products.length;j++){
        //         if(data[0].products[j].pId==id){
        //             x=1;
        //         }
        //     }
        //     if(x==undefined){
        //         await mongo.updateProduct("username",req.session.username,id);
        //         // await updateFunction("username",req.session.username,id)
        //             console.log("Successfully updated");
        //         }
        //     }
        let value;
            if(database == 'sql'){
                value = await sql.updateProduct("username",req.session.username,id);
            }
            else {
                value = await mongo.updateProduct("username",req.session.username,id);
            }
          if(!value){
              res.statusCode=300;
              
          }
          res.send();
        }
    
})

module.exports=router