const User=require('../userSchema');
const findFunction=require('../Database/find')
const sendMail=require('../middlewares/sendMail')
const mongo=require('../Database/mongo')
const sql=require('../Database/sql');
const express=require('express');
const router=express.Router()
//const find=require('../Database/find')
console.log("Inside signup")
router.route('/')
.get(async(req,res)=>{
    if(req.session.username==undefined){
        res.render("signup",{error:''});
    }
    else {
        let value= await mongo.findUser("username",req.session.username);
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
    
   
   
})
.post(async (req,res)=>{
    let {name,username,email,password}=req.body
    if(name==''||username==''||email==''||password==''){
        res.render('signup',{error:'Fields cant be empty'})
        return;
    }
    //checking if user already exists
    console.log("hello from the signup function")
    let obj=await mongo.findUser("username",username);
    // let obj= await findFunction("username",username)
   
        console.log(obj);
        if(obj.length!=0){
            res.render("signup",{error:"Username already Exists"});
            return;
        }
        else {
            let obj={name,username,email,password,isVerified:0,token:Date.now().toString(),products:[]}
            await mongo.createUser(obj);
           
                console.log(obj.token);
                console.log("user saved");
                req.session.isLoggedIn=true;
                req.session.isVerified=false;
                req.session.username=username;
                sendMail(req,res,obj.token,email);
                res.end("verify email first");
                return;
            
        }
     })
   

module.exports=router
