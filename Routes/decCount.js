const express=require('express');
const router=express.Router()
const findFunction=require('../Database/find')
const updateFunction=require('../Database/update')
router.post('/',async (req,res)=>{
    console.log("In the incCount End Point");
    //console.log(req.body);
    if(req.session.username==undefined){
        res.render("login",{error:'Login First'});
    }
    else {
        let obj= await findFunction("username",req.session.username);
        let ans;
          for(let i=0;i<obj[0].products.length;i++){
                if(obj[0].products[i].pId==req.body.id){
                    ans=i;
                    if(obj[0].products[i].quantity>0){
                        obj[0].products[i].quantity--;

                    }
                }
            }
            let arr=obj[0].products;
            console.log(arr);
            await updateFunction("username",req.session.username,"products",arr);
            res.end("success");
    }
   
  
})

module.exports=router