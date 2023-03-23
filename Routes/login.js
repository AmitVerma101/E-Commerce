const User=require('../userSchema');
const findFunction=require('../Database/find')
const mongo=require('../Database/mongo')

// const sendMail=require('../middlewares/sendMail')

const express=require('express');
const router=express.Router()

router.route('/').get(async(req,res)=>{
    console.log(User);
    console.log("Inside Login");
    if(req.session.username==undefined){
        res.render("login",{error:''})
    }
    else {
        let value=await mongo.findUser("username",req.session.username);
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
   
}).post( async(req,res)=>{
    console.log(req.body);
    let {username,password}=req.body;
    if(username==''||password==''){
        res.render('login',{error:'Fields cant be empty'});
        return;
    }
    let obj= await mongo.findUser("username",username)
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
    })
    
module.exports=router;