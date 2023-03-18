const express=require('express');
const router=express.Router()
const findFunction=require('../Database/find')

router.post('/',async (req,res)=>{

    let obj= await findFunction("email",req.body.email);

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

    })
    


module.exports=router