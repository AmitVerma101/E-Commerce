const express = require('express')
const app= express();
const sendMail=require('../middlewares/sendMail')
//const express=require('express');
const User=require('../userSchema');
const router=express.Router()
const mongo=require('../Database/mongo')
const sql=require('../Database/sql');
require('dotenv').config();
let database = process.env.database
const crypto = require('crypto');
//adding the addToCart controller
const addToCart  = async (req,res)=>{
    if(req.session.username==undefined){
        res.end("Not authorized");
    }
    else {
        let id=req.body.id
      
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
    
}

//adding the decCount controller
const decCount = async (req,res)=>{
    console.log("In the decCount End Point");
    //console.log(req.body);
    if(req.session.username==undefined){
        res.render("login",{error:'Login First'});
    }
    else {
        // let obj= await findFunction("username",req.session.username);
        // let ans;
        //   for(let i=0;i<obj[0].products.length;i++){
            //         if(obj[0].products[i].pId==req.body.id){
                //             ans=i;
                //             if(obj[0].products[i].quantity>0){
                    //                 obj[0].products[i].quantity--;
                    
                    //             }
                    //         }
                    //     }
                    //     let arr=obj[0].products;
                    //     console.log(arr);
                    //   await mongo.updateUser("username",req.session.username,"products",arr)
                    if(database == 'sql'){
                        await sql.updateCart("username",req.session.username,"id",req.body.id,"decCount");
                    }
                    else {
                        await mongo.updateCart("username",req.session.username,"id",req.body.id,"decCount");
                    }
       //             let obj=await mongo.findUser("username",req.session.username)
            // await updateFunction("username",req.session.username,"products",arr);
            res.end("success");
    }
   
  
}

//adding the incCount controller

const incCount = async (req,res)=>{
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
   
  
}

//adding the  deleteFromCart controller 

const deleteFromCart = async (req,res)=>{
    console.log("In the deleteFromCart End Point");
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
}

//adding the placeOrder controller 
const placeOrder = async (req,res)=>{
    console.log("In the place order end point")
        let {id,sellerName,quantity,cost} = req.body;
        console.log("cost",cost);
        console.log(id,sellerName);
        if(database == 'sql'){
            await sql.createOrder({id:crypto.randomBytes(3).toString('hex'),username:req.session.username,sellerName:sellerName,productId:id,status:0,quantity:quantity,total:cost})
        }
        else {
            await mongo.createOrder({id:crypto.randomBytes(3).toString('hex'),username:req.session.username,sellerName:sellerName,productId:id,status:0,quantity:quantity,total:cost})
        }
        
        res.end("order saved successfully");
}

//adding the displayCart controller

const displayCart = async (req,res)=>{


    if(req.session.username==undefined){
      res.render("login",{error:"Login First"});
    }
    else {

    //  let obj= await mongo.findUser("username",req.session.username);
    let obj;
      if( database == 'sql'){
        obj=await sql.findUser("username",req.session.username);
      }
      else {
        obj = await mongo.findUser("username",req.session.username);
      }
      console.log("Printing the value of obj2 in the displayCart End Point")
      console.log(obj)
      
      if( database == 'sql'){
         
        let {newArr1,newArr2} = await sql.findProductFromCart(obj[0].u_id);
        if(obj.length!=0){
          if(req.session.isLoggedIn==true&&obj[0].isVerified){
            res.render("cartDetails",{products:newArr2,arr:newArr1,username:req.session.username,stripe:process.env.publicStripeKey})
          }
          else {
            res.render("login",{error:"Verify Email First"})
          }
      }
      else {
        res.render("login",{error:"Login First"});
      }
    }
      else {
        if(obj.length!=0){
          let {newArr1,newArr2} = await mongo.findProductFromCart(obj[0])
          if(req.session.isLoggedIn==true&&obj[0].isVerified){
            res.render("cartDetails",{products:newArr2,arr:newArr1,username:req.session.username,stripe:process.env.publicStripeKey})
          }
          else {
            res.render("login",{error:"Verify Email"});
          }
        }
        else {
          res.render("login",{error:"Login First"});
        }
      }
     
    //  console.log("consoling the value of newArr1 and newArr2 in the displayCart endpoint");
    //  console.log(newArr1,newArr2);
        // let obj= await findFunction("username",req.session.username)
        // if(obj.length!=0){
        //     if(req.session.isLoggedIn==true&&obj[0].isVerified){
            //   console.log("printing the obj")
            //   console.log(obj)
              
            // let newArray=obj[0].products;
            // console.log("printing the newArray")
            // console.log(newArray)
            // let newArrFinal=[]
            // let newArr=[]
            // for(let i=0;i<newArray.length;i++){
            //   let data = await mongo.findProduct(0,1,"id",newArray[i].pId);
            //   // let data= await findProduct(0,1,"id",newArray[i].pId)
            //   console.log("inside display")
            //    console.log(data)
            //    console.log(data[0])
            //     if(data.length!=0){
            //         newArrFinal.push(data[0]);
            //         newArr.push(newArray[i])
            //       //   console.log(newArrFinal);
            //     }
                
                
            // }
            // console.log("consoling both arrays")
            // console.log(newArrFinal)
            // console.log(newArr)
            //I made the changes here 
          //   res.render("cartDetails",{products:newArr2,arr:newArr1,username:req.session.username})
          // }
          // else {
          //     res.render("login",{error:"Verify Email First"})
          // }
        // }
        // else {
        //   res.render("login",{error:"Login First"});
        // }
     
}
}
module.exports = {addToCart,decCount,incCount,deleteFromCart,placeOrder,displayCart}