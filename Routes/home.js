const express=require('express');
const router=express.Router()
const mongo=require('../Database/mongo')
const sql=require('../Database/sql');
require('dotenv').config();
let database = process.env.database
router.get('/',async (req,res)=>{
    console.log(req.session.username)
    if(req.session.username==undefined){
        res.render("home");
    }
    else {
      //  let value= await mongo.findUser("username",req.session.username);
      let value;
        if(database == 'sql'){
             value=await sql.findUser("username",req.session.username);
           
        }
        else {
            value = await mongo.findUser("username",req.session.username);
        }
        console.log("printing in the home endpoint")
      //  console.log(value2);
    //  let value=await findFunction("username",req.session.username)
     value=value[0].isVerified
    if(req.session.isLoggedIn==true&&value){
        res.redirect("/products");
    }
    else { 
       res.render("home");
    }
}
})

module.exports=router