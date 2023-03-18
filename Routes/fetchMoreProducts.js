const User=require('../userSchema');
const findFunction=require('../Database/findProduct')
// const sendMail=require('../middlewares/sendMail')

const express=require('express');
const router=express.Router()

router.post('/',async(req,res)=>{
    if(req.session.username==undefined){
        res.render("login",{error:"Login First to fetch the products Page"});
    }
    else{
        req.session.products++;
        let obj= await findFunction(req.session.products,5)
        console.log("printing the object")
        console.log(obj)
        res.json(obj);
}
})
module.exports=router