const express = require('express')
const app= express();
const sellerMail=require('../middlewares/sellerMail')
//const express=require('express');
const User=require('../userSchema');
const router=express.Router()
const mongo=require('../Database/mongo')
const sql=require('../Database/sql');
require('dotenv').config();
const crypto = require('crypto')
let database = process.env.database


//adding the adminPanel controller 

const adminPanel = async (req,res)=>{
    if(req.session.username!='Admin'){
        res.end("You do not have permission to access the page")
    }
    else {
        res.render("adminPanel",{error:''});
    }
}

//adding the AddSeller Controller 

const AddSeller = async (req,res)=>{
    if(req.session.username!='Admin'){
        res.end("You do not have the authorization to access the page");
    }
    else {
        let username="Seller"+crypto.randomBytes(4).toString('hex');
        let password=crypto.randomBytes(5).toString('hex');
        let val= {name:req.body.name,username:username,email:req.body.email,password:password,seller:'seller'};
     //   let seller= await mongo.createSeller(val);
     let seller;
     if(database == 'sql'){
         seller= await sql.createSeller(val);
     }
     else {
        seller = await mongo.createSeller(val);
     }
             sellerMail(req,res,req.body.email,username,password);
             res.render("adminPanel",{error:'Saved Successfully'});

         
        
    }
}

module.exports = {adminPanel,AddSeller};