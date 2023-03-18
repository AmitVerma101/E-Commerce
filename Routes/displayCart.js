const express=require('express');
const router=express.Router()
const findFunction=require('../Database/find')
const findProduct=require('../Database/findProduct');

router.get('/',async (req,res)=>{


      if(req.session.username==undefined){
        res.render("login",{error:"Login First"});
      }
      else {
          let obj= await findFunction("username",req.session.username)
          if(obj.length!=0){
              if(req.session.isLoggedIn==true&&obj[0].isVerified){
              let newArr=obj[0].products;
              let newArrFinal=[]
              for(let i=0;i<newArr.length;i++){
                let data= await findProduct(0,1,"id",newArr[i].pId)
                 
                  if(data.length!=0){
                      newArrFinal.push(data[0]);
                    //   console.log(newArrFinal);
                  }
                  
              }
              console.log("consoling both arrays")
              console.log(newArrFinal)
              console.log(newArr)
              res.render("cartDetails",{products:newArrFinal,arr:newArr,username:req.session.username})
            }
            else {
                res.render("login",{error:"Verify Email First"})
            }
          }
          else {
            res.render("login",{error:"Login First"});
          }
       
}
})

module.exports=router