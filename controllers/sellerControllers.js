const express = require('express')
const app= express();
const multer=require('multer')
const bodyParser = require('body-parser');
//const express=require('express');
const User=require('../userSchema');
const router=express.Router()
const mongo=require('../Database/mongo')
const sql=require('../Database/sql');
const crypto = require('crypto');
require('dotenv').config();
let database = process.env.database
const upload = multer({ dest: 'products/' })
app.use(bodyParser.urlencoded({ extended: true }));

//adding the sellerLogin controller

const sellerLoginGet   = async (req,res)=>{
    if(req.session.isLoggedIn==true){
        res.render("sellerProducts",{username:req.session.username});
        return;
    }
    res.render("sellerLogin",{error:''})
}

const sellerLoginPost = async (req,res)=>{
    if(req.session.isLoggedIn==true){
        res.render('sellerProducts',{username:req.session.username});
        return;
    }
// let obj= await mongo.findSeller("username",req.body.username,"password",req.body.password);
let obj;
if(database == 'sql'){
    obj=await sql.findSeller("username",req.body.username,"password",req.body.password);
}
else {
    obj=await mongo.findSeller("username",req.body.username,"password",req.body.password);
}
 console.log("printing the value of obj2 in the sellerLogin endPoint");
 console.log(obj);
     if(obj.length==1){
        req.session.isLoggedIn=true;
        req.session.username=req.body.username;
        res.render("sellerProducts",{username:req.session.username});
     }
     else {
        res.render('sellerLogin',{error:'Wrong username or password'});
     }
}


//adding the fetchSellerProducts controller

const fetchSellerProducts = async (req,res)=>{
    console.log("In the fetchSellerProducts endpoint");
   // let obj= await mongo.findProduct(0,1000,"username",req.session.username);
   let obj;
   if(database ==  'sql'){
     obj= await sql.findProduct(0,1000,"username",req.session.username);
   }
   else {
    obj = await mongo.findProduct(0,1000,"username",req.session.username);
   }
    // let obj=await Product.find({username:req.session.username})
    console.log("consoling the value of obj2 ");
  //  console.log(obj2);
    console.log(obj);
     res.json(obj);
}

// adding the addSellerProduct controller

const addSellerProduct  = async (req,res)=>{
    let image=req.file.filename;
     const {name,descMain,Rating,description,warranty,color,RAM,stocks,price}=req.body;
     let arr={descMain:descMain,Rating:Rating,description:description,warranty:warranty,color:color,RAM:RAM,stocks:stocks,price:price,active:1};
     let val={name:name,image:image,username:req.session.username,id:crypto.randomBytes(3).toString('hex')};
     if(database == 'sql'){
         await sql.createProduct(val,arr);
     }
     else {
         await mongo.createProduct(val,arr);
     }
    console.log("saved successfully");
    res.render("sellerProducts",{username:req.session.username});
}

//adding the deleteProduct controller

const deleteProduct = async (req,res)=>{
    let id=(req.body.id)
    console.log(req.body)
    console.log(id)
     if(database == 'sql'){
         await sql.deleteProduct(id);
     }
     else {
         await mongo.deleteProduct(id);
     }
    res.end("Record deleted successfully")
}


const resolveRequest = async (req,res)=>{
    console.log("In resolve request endpoint")
    console.log(req.body);
    console.log(req.body.id);
  //  await mongo.updateOrders("id",req.body.id,"status",1,"productId",req.body.productId);
  if(database == 'sql'){
    await sql.updateOrders("id",req.body.id,"status",1,"productId",req.body.productId);
  }
  else {
    await mongo.updateOrders("id",req.body.id,"status",1,"productId",req.body.productId);
  }
    // await Order.updateOne({id:req.body.id},{status:1});
    res.end('success')
}

//adding the rejectRequest controller

const rejectRequest  = async (req,res)=>{
    console.log(req.body.id);
    if(database == 'sql'){
        await sql.updateOrders("id",req.body.id,"status",-1,"p_id",req.body.productId);
    }
    else {
        await mongo.updateOrders("id",req.body.id,"status",-1,"p_id",req.body.productId);
    }
    // await Order.updateOne({id:req.body.id},{status:1});
    res.end('success')
}

//adding the sellerOrders controller

const sellerOrders = async (req,res)=>{
  
    //  let order= await mongo.findOrders("sellerName",req.session.username,"status",0);
    let order;
    if(database == 'sql'){
      order= await sql.findOrders("sellerName",req.session.username,"status",0);
    }
    else {
      order = await mongo.findOrders("sellerName",req.session.username,"status",0);
    }
     
      console.log(order)
      console.log("Printing the value of order2")
    //  console.log(order2);
      let array=[]
      for(let i=0;i<order.length;i++){
        //  let product = await mongo.findProduct(0,1000,"id",order[i].productId);
        let product;
        if(database == 'sql'){
           product = await sql.findProduct(0,1000,"id",order[i].productId);
  
        }
        else {
          product = await mongo.findProduct(0,1000,"id",order[i].productId);
        }
          array.push(product[0]);
      }
      console.log("In the seller orders function");
      console.log(order);
      console.log(array);
    
      res.render('sellerOrders',{products:array,arr:order,username:req.session.username})
    
  }

  //adding the updateProducts controller 

  const updateProducts  = async (req,res)=>{
    let image=req.file.filename;
    let {id,name,descMain,Rating,description,warranty,color,RAM,stocks,price}=req.body;
    price = parseInt(price);
    stocks = parseInt(stocks);
    let arr={descMain,Rating,description,warranty,color,RAM,stocks,price}
    console.log('consoling here');
    console.log(id,name,image,arr);
    console.log(typeof name)
    if(database == 'sql'){
        await sql.updateSellerProduct(id,name,image,arr); 
    }
    else {
        await mongo.updateSellerProduct(id,name,image,arr)

    }
   res.render("sellerProducts",{username:req.session.username})
}

//adding the logout route
const logout = (req,res)=>{
  if(req.session!=undefined){
    req.session.destroy()
  }
  res.redirect('/')
}
module.exports = {sellerLoginGet,sellerLoginPost,fetchSellerProducts,addSellerProduct,deleteProduct,resolveRequest,rejectRequest,sellerOrders,updateProducts,logout};