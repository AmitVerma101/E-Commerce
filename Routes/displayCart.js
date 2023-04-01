const express=require('express');
const router=express.Router()
// const findFunction=require('../Database/find')
// const findProduct=require('../Database/findProduct');
const mongo=require('../Database/mongo')
const sql=require('../Database/sql');
require('dotenv').config();
let database = process.env.database;
router.get('/',async (req,res)=>{


      if(req.session.username==undefined){
        res.render("login",{error:"Login First"});
      }
      else {

      //  let obj= await mongo.findUser("username",req.session.username);
      let obj;
        if( database == 'sql'){
          obj=await sql.findUser("username",req.session.username);
        }
        else {
          obj = await mongo.findUser("username",req.session.username);
        }
        console.log("Printing the value of obj2 in the displayCart End Point")
        console.log(obj)
        
        if( database == 'sql'){
           
          let {newArr1,newArr2} = await sql.findProductFromCart(obj[0].u_id);
          if(obj.length!=0){
            if(req.session.isLoggedIn==true&&obj[0].isVerified){
              res.render("cartDetails",{products:newArr2,arr:newArr1,username:req.session.username,stripe:process.env.publicStripeKey})
            }
            else {
              res.render("login",{error:"Verify Email First"})
            }
        }
        else {
          res.render("login",{error:"Login First"});
        }
      }
        else {
          if(obj.length!=0){
            let {newArr1,newArr2} = await mongo.findProductFromCart(obj[0])
            if(req.session.isLoggedIn==true&&obj[0].isVerified){
              res.render("cartDetails",{products:newArr2,arr:newArr1,username:req.session.username,stripe:process.env.publicStripeKey})
            }
            else {
              res.render("login",{error:"Verify Email"});
            }
          }
          else {
            res.render("login",{error:"Login First"});
          }
        }
       
      //  console.log("consoling the value of newArr1 and newArr2 in the displayCart endpoint");
      //  console.log(newArr1,newArr2);
          // let obj= await findFunction("username",req.session.username)
          // if(obj.length!=0){
          //     if(req.session.isLoggedIn==true&&obj[0].isVerified){
              //   console.log("printing the obj")
              //   console.log(obj)
                
              // let newArray=obj[0].products;
              // console.log("printing the newArray")
              // console.log(newArray)
              // let newArrFinal=[]
              // let newArr=[]
              // for(let i=0;i<newArray.length;i++){
              //   let data = await mongo.findProduct(0,1,"id",newArray[i].pId);
              //   // let data= await findProduct(0,1,"id",newArray[i].pId)
              //   console.log("inside display")
              //    console.log(data)
              //    console.log(data[0])
              //     if(data.length!=0){
              //         newArrFinal.push(data[0]);
              //         newArr.push(newArray[i])
              //       //   console.log(newArrFinal);
              //     }
                  
                  
              // }
              // console.log("consoling both arrays")
              // console.log(newArrFinal)
              // console.log(newArr)
              //I made the changes here 
            //   res.render("cartDetails",{products:newArr2,arr:newArr1,username:req.session.username})
            // }
            // else {
            //     res.render("login",{error:"Verify Email First"})
            // }
          // }
          // else {
          //   res.render("login",{error:"Login First"});
          // }
       
}
})

module.exports=router