const User=require('../userSchema');
const findFunction=require('../Database/find')
const sendMail=require('../middlewares/sendMail')

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
        let value=await findFunction("username",req.session.username)
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
    let obj= await findFunction("username",username)
   
        console.log(obj);
        if(obj.length!=0){
            res.render("signup",{error:"Username already Exists"});
            return;
        }
        else {
           let user=new User({name,username,email,password,isVerified:false,token:Date.now().toString(),products:[]});
            user.save().then(()=>{
                console.log(user.token);
                console.log("user saved");
                req.session.isLoggedIn=true;
                req.session.isVerified=false;
                req.session.username=username;
                sendMail(req,res,user.token,email);
                res.end("verify email first");
                return;
            })
        }
     })
   

module.exports=router
