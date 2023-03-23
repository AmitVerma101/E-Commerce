const express=require('express');
const router=express.Router()

router.get('/',async (req,res)=>{
    if(req.session.username!='Admin'){
        res.end("You do not have permission to access the page")
    }
    else {
        res.render("adminPanel",{error:''});
    }
})

module.exports=router