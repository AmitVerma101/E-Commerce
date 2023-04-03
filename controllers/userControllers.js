const express = require('express')
const app= express();
const sendMail=require('../middlewares/sendMail')
//const express=require('express');
const User=require('../userSchema');
const router=express.Router()
const mongo=require('../Database/mongo')
const sql=require('../Database/sql');
require('dotenv').config();
const userController= require('../controllers/userControllers')
let database = process.env.database

//adding the home controller

const home = async (req,res)=>{
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
}

//adding the signup controller

const signupGet =  async(req,res)=>{
    if(req.session.username==undefined){
        res.render("signup",{error:''});
    }
    else {
     //   let value= await mongo.findUser("username",req.session.username);
     let value;
        if(database == 'sql'){
            value=await sql.findUser("username",req.session.username);
        }
        else {
            value = await mongo.findUser("Username",req.session.username);
        }
      //  console.log(value2);
        // let value=await findFunction("username",req.session.username)
        value=value[0].isVerified
       if(req.session.isLoggedIn==true&&value){
           res.redirect("/products");
       }
       else if(!value){ 
          res.render("signup",{error:'Verify using mail'});
       }
       else {
        res.render("signup",{error:''});
       }
    } 
}

const signupPost = async (req,res)=>{
    let {name,username,email,password}=req.body
    if(name==''||username==''||email==''||password==''){
        res.render('signup',{error:'Fields cant be empty'})
        return;
    }
    //checking if user already exists
    console.log("hello from the signup function")
  //  let obj=await mongo.findUser("username",username);
  let obj;
  if(database == 'sql'){
      obj=await sql.findUser("username",username);
  }
  else {
    obj = await mongo.findUser("username",username);
  }

    // let obj= await findFunction("username",username)
   
        console.log(obj);
        if(obj.length!=0){
            res.render("signup",{error:"Username already Exists"});
            return;
        }
        else {
            let obj={name,username,email,password,isVerified:0,token:Date.now().toString(),products:[],role:'user'}
            await mongo.createUser(obj);
            await sql.createUser(obj);
           
                console.log(obj.token);
                console.log("user saved");
                req.session.isLoggedIn=true;
                req.session.isVerified=false;
                req.session.username=username;
                sendMail(req,res,obj.token,email);
                res.end("verify email first");
                return;
            
        }
     }


     //adding the login controller
     const loginGet = async(req,res)=>{
        console.log(User);
        console.log("Inside Login");
        if(req.session.username==undefined){
            res.render("login",{error:''})
        }
        else {
          //  let value=await mongo.findUser("username",req.session.username);
          let value;
            if(database == 'sql'){
                value = await sql.findUser("username",req.session.username);
            }
            else {
                value = await mongo.findUser("username",req.session.username); 
            }
            console.log("Printing the value inside the login function")
            console.log(value);
            // let value=await findFunction("username",req.session.username)
            value=value[0].isVerified
           if(req.session.isLoggedIn==true&&value){
               res.redirect("/products");
           }
           else if(!value){ 
              res.render("login",{error:'Verify using mail'});
           }
           else {
            res.render("login",{error:''});
           }
        }
       
    }

     const loginPost = async(req,res)=>{
        console.log(req.body);
        let {username,password}=req.body;
        if(username==''||password==''){
            res.render('login',{error:'Fields cant be empty'});
            return;
        }
       // let obj= await mongo.findUser("username",username)
       let obj;
       if(database == 'sql'){
           obj = await sql.findUser("username",username);
       }
       else {
           obj = await mongo.findUser("username",username);
       }
        console.log("Printing the obj2 in the login endpoint")
        console.log(obj);
        // let obj= await findFunction("username",username)
        
                if(obj.length!=0){
                    console.log("printing the obj")
                    console.log(obj[0].username,obj[0].password);
                    if(obj[0].username==username&&obj[0].password==password&&obj[0].isVerified){
                        req.session.isLoggedIn=true;
                        req.session.isVerified=true;
                        req.session.username=username;        
                        res.redirect('/products')
                        return;
                    }
                    else if(!obj[0].isVerified){
                        res.render("login",{error:'Verify email first'});
                    }
                    else {
                        res.render('login',{error: 'Wrong Username or password'});
                        return;
                    }
                }
                else {
                    res.render('login',{error:"No User exists"})
                    return;
                }
        }

        //adding the products controller

        const products  =  async(req,res)=>{
            if(req.session.username==undefined){
                res.render("login",{error:"Login First to fetch the products Page"});
            }
            else{
              //  let obj= await mongo.findUser("username",req.session.username)
              let obj;
              if(database == 'sql'){
                  obj=await sql.findUser("username",req.session.username);
              }
              else {
                obj = await mongo.findUser("username",req.session.username);
              }
                console.log("Printing in the products endpoint")
              //  console.log(obj2);
                // let obj= await findFunction("username",req.session.username)
                obj=obj[0].isVerified;
            
            if(req.session.isLoggedIn==true&&obj){
                req.session.products=-1;
                    res.render("products",{username:req.session.username});
            }
            else{
                res.render("login",{error:'Verify using mail'});
            }
        }
        }

        //adding the fetchMoreProducts Controller

        const fetchMoreProducts = async(req,res)=>{
            if(req.session.username==undefined){
                res.render("login",{error:"Login First to fetch the products Page"});
            }
            else{
                req.session.products++;
             //   let obj=await mongo.findProduct(req.session.products,5);
             let obj;
                if(database == 'sql'){
                    obj = await sql.findProduct(req.session.products,5);
                }
                else {
                    obj = await mongo.findProduct(req.session.products,5)
                }
                // let obj= await findFunction(req.session.products,5)
                console.log("printing the object")
                console.log(obj)
                res.json(obj);
        }
        }

        //adding the getDetails controller

        const getDetails = async (req,res)=>{
            console.log("In the getDetails endpoint");
            console.log(req.session.username)
            if(req.session.username==undefined){
                res.render("home");
            }
            else {
             //   let obj= await mongo.findProduct(0,1,"id",req.body.id);
             let obj;
             if(database == 'sql'){
                 obj=await sql.findProduct(0,1,"id",req.body.id);
             }
             else {
                obj = await mongo.findProduct(0,1,"id",req.body.id);
             }
                console.log("printing the value of obj in the getDetails endpoint ",obj);
                // let obj=findFunction(0,1,"id",req.body.id);
               
                    res.json(obj[0]);
                }
        }

        //adding the verifyEmail controller

       const verifyEmail =  async (req,res)=>{
            const {token}=req.params;
            console.log("printing token");
            console.log(token);
            let obj;
            if(database == 'sql'){
                obj=await sql.findUser("token",token);
            }
            else {
                obj=await mongo.findUser("token",token);
            }
            // console.log("printing the value of obj2");
            // console.log(obj2);
            // let obj= await findFunction("token",token);
            if(obj.length==0){
                res.end("Fail to verify");
        
            }
            else {
                if(database == 'sql'){
                    await sql.updateUser("token",token,"isVerified",1);
                }
                else {
                    await mongo.updateUser("token",token,"isVerified",1);
                }
                // await updateFunction("token",token,"isVerified",true);
                res.end("You are verified now");
                return;
            }
        }

        //adding the showOrders controller

        //adding a utility function
        async function getOrderInArray(orders){
           
            let array = [];
            for(let i = 0 ;i< orders.length;++i){
                console.log("here");
                let product;
              //  let product = await mongo.findProduct(0,1000,'id',orders[i].productId);
              if(database == 'sql'){
                  product = await sql.findProduct(0,1000,'id',orders[i].productId);
              }
              else {
                product = await mongo.findProduct(0,1000,'id',orders[i].productId)
              }
              console.log("printing the value of product[0] in the findOrders function")
              console.log(product[0])
                if(product[0]!=undefined){
                    console.log(product[0]);
                    array.push(product[0]);

                }
            }
            return array;
        }
     //controller
        const showOrders = async (req,res)=>{
            console.log("In the show orders function")
            console.log(req.session.username);
           //let orders= await mongo.findOrders("username",req.session.username);
           let orders;
           if(database == 'sql'){
               orders= await sql.findOrders("username",req.session.username);
           }
           else {
            orders = await mongo.findOrders("username",req.session.username);
           }
            console.log("printing the orders array");
            console.log(orders);
            let newArrFinal= await getOrderInArray(orders);
            console.log("Printing the orders array again")
            console.log(orders)
            console.log("printing the newArrFinal")
            console.log(newArrFinal);
            console.log("printing the orders array")
            console.log(orders)
            res.render("order",{products:newArrFinal,arr:orders,username:req.session.username})
        }
    

    //adding the sendDynamicMail controller

    const sendDynamicMail = async (req,res)=>{
        let obj;
        if(database == 'sql'){
            obj= await sql.findUser("email",req.body.email)
        }
        else {
          obj = await mongo.findUser("email",req.body.email);
        }
          // let obj= await findFunction("email",req.body.email);
      
              if(obj.length!=0){
                  if(obj[0].isVerified){
                      req.session.isLoggedIn=true;
                      req.session.username=obj[0].username;
                      res.redirect('/changePassword')
      
                  }
                  else {
                      res.render("login",{error:'Verify Email first'})
                  }
              }
              else {
                  res.end("Please Enter valid email")
              }
      
          }


          //adding the changePassword controller 

          const changePassword  = async (req,res)=>{

            if(req.session.username==undefined){
                res.render("login",{error:'Login First'})
            }
            else {
               // let obj= await mongo.findUser("username",req.session.username)
               let obj;
               if(database == 'sql'){
                   obj=await sql.findUser("username",req.session.username);
               }
               else {
                   obj = await mongo.findUser("username",req.session.username);
               }
              //  console.log(obj2);
                // let obj=await findFunction("username",req.session.username)
                obj=obj[0].isVerified;
                if(req.session.isLoggedIn&&obj){
                    res.render("changePassword");
                }
                else {
                    res.render("login",{error:"Verify Email first"});
                }
            }
        }

        //adding the updatePassword controller

        const updatePassword = async (req,res)=>{
   
            // let obj= await mongo.findUser("username",req.session.username);
            let obj;
            if(database == 'sql'){
                obj= await sql.findUser("username",req.session.username);
            }
            else {
             obj = await mongo.findUser("username",req.session.username);
            }
             // let obj=await findFunction("username",req.session.username);
         
                     if(obj.length!=0){
                         // obj[0].password=req.body.first;
                         if(database == 'sql'){
                             await sql.updateUser("username",req.session.username,"password",req.body.first);
                         }
                         else {
                             await mongo.updateUser("username",req.session.username,"password",req.body.first)
                         }
                         // await updateFunction("username",req.session.username,"password",req.body.first);
                              
                             let email=obj[0].email;
                             confirmMail(req,res,email);
                             res.end("Password Update successfully");      
                         }
                     
                     else {
                                 res.end("Some error occur while changing the password")   
                          }
                 
              }

module.exports = {home,signupGet,signupPost,loginGet,loginPost,products,fetchMoreProducts,getDetails,verifyEmail,showOrders,sendDynamicMail,changePassword,updatePassword};