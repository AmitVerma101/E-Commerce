const express=require('express');
const router=express.Router()
const findFunction=require('../Database/find')
const findProduct=require('../Database/findProduct');
const mongo=require('../Database/mongo')
router.get('/',async (req,res)=>{


      if(req.session.username==undefined){
        res.render("login",{error:"Login First"});
      }
      else {
        let obj= await mongo.findUser("username",req.session.username);
          // let obj= await findFunction("username",req.session.username)
          if(obj.length!=0){
              if(req.session.isLoggedIn==true&&obj[0].isVerified){
                console.log("printing the obj")
                console.log(obj)
                
              let newArray=obj[0].products;
              console.log("printing the newArray")
              console.log(newArray)
              let newArrFinal=[]
              let newArr=[]
              for(let i=0;i<newArray.length;i++){
                let data = await mongo.findProduct(0,1,"id",newArray[i].pId);
                // let data= await findProduct(0,1,"id",newArray[i].pId)
                console.log("inside display")
                 console.log(data)
                 console.log(data[0])
                  if(data.length!=0){
                      newArrFinal.push(data[0]);
                      newArr.push(newArray[i])
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