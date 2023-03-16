const express =require('express')
const fs=require('fs')
const bodyParser = require('body-parser')
const app=express();
//making connections with db
const mongoose=require('mongoose')
const User=require('./userSchema')
const Product=require('./productSchema')
mongoose.connect("mongodb://127.0.0.1:27017/ECommerce").then(function(){
    console.log("connected successfully")
})



const checkAuth=require('./middlewares/auth');
const products=require('./products.js')
const forgotPassword=require('./middlewares/forgotPassword')
const confirmMail=require('./middlewares/confirmMail')
//const checkAuthSignup=require('./middlewares/authSignup');
app.set('view engine','ejs');
const session=require('express-session');
app.use(express.static("public"));
const sendMail = require('./middlewares/sendMail');
app.use(bodyParser.json());
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
  }))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("products"))
//creating routes 


app.get('/',(req,res)=>{
    if(req.session.isLoggedIn==true&&req.session.isVerified==true){
        res.redirect("/result");
    }
    else {
        // for(let i=0;i<products.length;i++){
        //     let product=new Product({id:products[i].id,name:products[i].name,image:products[i].image,description:products[i].description});
        //     product.save().then(()=>{
        //         console.log("products are saved");
        //         // console.log(user.token);
        //         // console.log("user saved");
        //         // req.session.isLoggedIn=true;
        //         // req.session.isVerified=false;
        //         // req.session.username=username;
        //         // sendMail(req,res,user.token);
        //         // res.end("verify email first");
        //         // return;
        //     })
        // }
        res.render("home");
    }
})


app.route('/signup').get((req,res)=>{
    if(req.session.isLoggedIn){
       res.redirect('/result')
    }
    else {
        res.render("signup",{error:''});
    }
   
   
})
.post((req,res)=>{
    let {name,username,email,password}=req.body
    if(name==''||username==''||email==''||password==''){
        res.render('signup',{error:'Fields cant be empty'})
        return;
    }
    //checking if user already exists
    User.find({username: username}).then((obj)=>{
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
    //reading the database
    // fs.readFile('./db.txt',"utf-8",(err,data)=>{
    //     let obj=[];
    //     flag=false;
    //     if(err){
    //         res.end("Error Occur while openning the file")
    //     }
    //     else {
    //             if(data.length!==0){
    //                 obj=JSON.parse(data);
    //             }
    //             for(let i=0;i<obj.length;i++){
                    
    //                 if(obj[i].username==username){
    //                     console.log("here")
    //                     flag=true;
    //                     break;
    //                 }
    //             }
    //             if(flag){
    //                 res.render("signup",{error:"Username already Exists"});
    //                 return;
    //             }
    //             else {
    //                 let newObj={name,username,email,password,isVerified:false,token:Date.now(),products:[]};
    //                 obj.push(newObj);
    //                 fs.writeFile('./db.txt',JSON.stringify(obj),(err)=>{
    //                     if(err){
    //                         res.end("Fail to write in the file");
    //                     }
    //                     else {
    //                         req.session.isLoggedIn=true;
    //                         req.session.isVerified=false;
    //                         req.session.username=username;
    //                        // res.redirect("/result");
    //                         console.log("Ye chalta h kya")
    //                         sendMail(req,res,newObj.token);
    //                         res.end("verify email first");
    //                     }
    //                 })
    //             }
               
                
    //     }
    // })
    // console.log(name);
  //  res.end("hello");
})
app.route('/login').get((req,res)=>{
    console.log("Inside Login");
    if(req.session.isLoggedIn==true){
        res.redirect('/result')
        return;
    }
    else {
        res.render("login",{error:''});
        return;
    }

    // console.log(req.session.username);
    // if(req.session.isLoggedIn==true&&req.session.isVerified){
    //     res.render("result",{username:req.session.username})
        
    // }
    // else{
    //     res.render("login",{error:''});
    // }
    
}).post((req,res)=>{
    console.log(req.body);
    let {username,password}=req.body;
    if(username==''||password==''){
        res.render('login',{error:'Fields cant be empty'});
        return;
    }
    User.find({username:username}).then(function(obj){
            if(obj.length!=0){
                console.log("printing the obj")
                console.log(obj[0].username,obj[0].password);
                if(obj[0].username==username&&obj[0].password==password){
                    req.session.isLoggedIn=true;
                    req.session.isVerified=true;
                    req.session.username=username;        
                    res.redirect('/result')
                    return;
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
    // fs.readFile('./db.txt',"utf-8",(err,data)=>{
    //     let obj=[];
    //     if(err){
    //         res.end("Error in opening the file at the login");
    //     }
    //     else {
    //             if(data.length!=0){
    //                 obj=JSON.parse(data);
    //             }
    //             console.log(obj)
    //             for(let i=0;i<obj.length;i++){
                
    //                 if(obj[i].username==username&&obj[i].password==password){
    //                     req.session.isLoggedIn=true;
    //                     req.session.isVerified=true;
    //                     req.session.username=username;        
    //                     res.redirect('/result')
    //                     return;
    //                 }
    //             }
    //             res.render('login',{error: 'Wrong Username or password'});
    //     }
    // })
    // res.end("Checking your details");
})

app.get('/result',async (req,res)=>{
        if(req.session.username==undefined){
            res.render("login",{error:"Login First"})
            return;
        }
        let obj=  await User.find({username:req.session.username})

        console.log("Printing the value of the isVerified in the result page"+req.session.isVerified);
        console.log("I am here");
        if(req.session.isLoggedIn&&obj[0].isVerified){
            res.redirect('/products');
        
        }
        else{
            res.end("Verify the mail first to access the website");
        }
       
          
        
        // res.render("result",{username:req.session.username})
    
})
app.get('/logout',(req,res)=>{
    req.session.destroy();
    res.redirect('/');
})

app.get('/products',(req,res)=>{
    if(req.session.isLoggedIn==true&&req.session.isVerified){

        req.session.products=-1;
        Product.find({}).sort({id:'asc'}).limit(5).then(function(obj){
            console.log(obj);
            res.render("products",{product:obj,username:req.session.username});
        })
    }
    else{
        res.render("login",{error:"Login First to fetch the products Page"});
    }
    // let obj=products.slice(req.session.products,req.session.products+5);
    // console.log(obj);
    // res.render("products",{product:obj});
})

app.post('/fetchMoreProducts',(req,res)=>{
    req.session.products++;
    Product.find({}).skip(req.session.products*5).limit(5).then(function(obj){
        // res.render("products",{product:obj});
        console.log(obj);
    res.json(obj);

     })
    // console.log(req.session.products);
    // res.json(products.slice(req.session.products*5,req.session.products*5+5));
    
})

app.get('/verifyEmail/:token',(req,res)=>{
    const {token}=req.params;
    console.log("printing token");
    console.log(token);
    User.find({token:token}).then(function(obj){
        if(obj.length==0){
            req.session.isVerified=false;
        }
        else {
            obj[0].isVerified=true;
            console.log(obj[0]);
            req.session.isVerified=true;
            User.updateOne({username:req.session.username},{isVerified:true}).then(function(){
                res.end("You are verified now");
                return;
            });
        }
    })
    // fs.readFile('./db.txt',"utf-8",(err,data)=>{
    //     if(err){
    //         res.end("Fail to read the file db.txt");
    //     }
    //     else {
    //         data=JSON.parse(data);
    //         console.log(data);
    //         for(let x=0;x<data.length;x++){
    //             console.log("for loop")
    //             console.log(data[x].token)
    //             if(data[x].token==token){

    //                 req.session.isVerified=true;
    //                 console.log("Working in the if statement")
    //                 break;
    //             }
    //         }
    //        // console.log(data);
    //        console.log(req.session.isVerified);
    //        console.log("printing in the verifyEmail endpoint"+req.session.isVerified);
    //        res.redirect('/results')
    //     }
    // })
   
})
app.get('/results',(req,res)=>{
    console.log("Printing in the results endPoint"+req.session.isVerified);
    res.redirect('/result');
})

app.get('/changePassword',(req,res)=>{
    if(req.session.username!=undefined){
        console.log(req.session.username)
        res.render("changePassword")
    }
    else {
        res.end("Login first")
    }
  

})
app.post('/updatePassword',(req,res)=>{
    console.log(req.session.username)
    console.log(req.body.first)
    User.find({username:req.session.username}).then(function(obj){
            if(obj.length!=0){
                // obj[0].password=req.body.first;
                User.updateOne({username:req.session.username},{password:req.body.first}).then(function(){
                    let email=obj[0].email;
                    confirmMail(req,res,email);
                    res.end("Password Update successfully");      
                })
            }
            else {
                        res.end("Some error occur while changing the password")   
                 }
        
    })
    // fs.readFile('./db.txt',"utf-8",(err,data)=>{
    //     if(err){
    //         res.end("Fail to open the database");
    //     }
    //     else {
    //         data=JSON.parse(data);
    //         let index=0;
    //         let email;
    //         let ans;
    //         data.forEach(function(value){
    //             if(value.username==req.session.username){
    //                 // value.password=req.body.first;
    //                 ans=index;
    //             }
    //             index++;
    //         })
    //         data[ans].password=req.body.first;
    //         email=data[ans].email;
    //         fs.writeFile("./db.txt",JSON.stringify(data),(err)=>{
    //             if(err){
    //                 res.end("Fail to write in the file");
    //             }
    //             else {
    //                 confirmMail(req,res,email);
    //                 res.end("Password Update successfully");
    //             }
    //         })
    //     }
    // })
})
app.get('/forgotPassword',(req,res)=>{
   res.render("forgotPassword",{message:""});
})
app.post('/sendDynamicMail',(req,res)=>{
    User.find({email:req.body.email}).then(function(obj){
        if(obj.length!=0){
                req.session.isVerified=true;
                req.session.isLoggedIn=true;
                req.session.username=obj[0].username;
                res.redirect('/changePassword')
        }
        else {
            res.end("Please Enter valid email")
        }

    })
})
//     fs.readFile('./db.txt',"utf-8",(err,data)=>{
//         if(err){
//             res.end("Fail to open the file")
//         }
//         else {
//             data=JSON.parse(data);
//             let index=0;
//             let ans;
//             data.forEach(function(value){
//                 if(value.email==req.body.email){
//                     ans=index;
//                     console.log(ans);
//                 }
//                 index++;
//             })


//             req.session.isVerified=true;
//             req.session.isLoggedIn=true;
//             req.session.username=data[ans].username;
//             // res.redirect('/updatePassword')
//             res.redirect("/changePassword")

//         }
//     })
//     // forgotPassword(req,res,req.body.email);
//     // res.render("forgotPassword",{message:"A mail has been sent on your email address"})
//     // console.log(req.body.email);
// })
// app.post('/updateForgotPassword',(req,res)=>{
//    // console.log(req.body.password,req.body.confirmPassword)
//     console.log("hello")
// })
app.post('/addToCart',(req,res)=>{
    let id=JSON.parse(req.body.id)
    User.find({username:req.session.username}).then(function(data){
       // console.log(data)
        if(data.length!=0){
            let x;
            for(let j=0;j<data[0].products.length;j++){
                if(data[0].products[j].pId==id){
                    x=1;
                }
            }
            if(x==undefined){
                User.updateOne({username:req.session.username},{$push:{products:{pId:id,quantity:1}}}).then(function(){
                    console.log("Successfully updated");
                })
        //     data[0].products.push({pId:id,quantity:1});
        //    console.log(data[0].products)
            }
        }
    })
    // console.log("In add to Cart function")
    // fs.readFile('./db.txt',"utf-8",(err,data)=>{
    //     if(err){
    //         res.end("Fail to open the file");
    //     }
    //     else {
    //         data=JSON.parse(data);
    //         for(let i=0;i<data.length;i++){
    //             console.log("Inside the for loop")
    //             console.log(id,data[0].id);
    //             if(data[i].username==req.session.username){
    //                 console.log("here")
    //                 let x;
    //                 for(let j=0;j<data[i].products.length;j++){
    //                     if(data[i].products[j].pId==id){
    //                         x=1;
    //                     }
    //                 }
    //                 if(x==undefined){
    //                 data[i].products.push({pId:id,quantity:1});
    //                 console.log(data[i].products)
    //                 }
                    
    //                 //  data[i].selected=true;
    //             }
              
    //         }
           
    //         fs.writeFile('./db.txt',JSON.stringify(data),(err)=>{
    //             if(err){
    //                 res.end("Fail to write in the file");
    //             }
    //             console.log("file updated successfully");
                
               
    //         })
    //     }
    // })
    // console.log(id);
    // console.log(products)
   
    // console.log()

})

// function addProducts(newArr){
//     let newArrFinal=[]
//     for(let i=0;i<newArr.length;i++){
//         Product.find({id:newArr[i].pId}).then(function(obj){
//             if(obj.length!=0){
//                 newArrFinal.push(obj[0]);
//                // console.log(newArrFinal);
//             }
//         })
//     }
//     return newArrFinal;
// }
app.get('/displayCart',async (req,res)=>{
  //  console.log("Inside displayCart function")
  if(req.session.isLoggedIn==true&&req.session.isVerified){
    User.find({username:req.session.username}).then( async function(obj){
        if(obj.length!=0){
            let newArr=obj[0].products;
            console.log(newArr);
            let newArrFinal=[]
            for(let i=0;i<newArr.length;i++){
                let obj =  await Product.find({id:newArr[i].pId});
                if(obj.length!=0){
                    newArrFinal.push(obj[0]);
                    console.log(newArrFinal);
                }
                
            }
            res.render("cartDetails",{products:newArrFinal,arr:newArr,username:req.session.username})
        }
       })
   
}
else{
    res.render("login",{error:"Login First to fetch the products Page"});
}
   
    // fs.readFile('./db.txt',"utf-8",(err,data)=>{
    //     if(err){
    //         res.end("Fail to read the file");
    //     }
    //     else {
    //         data=JSON.parse(data);
    //         let newArr=data.filter(function(value){
    //             if(req.session.username==value.username){
    //                 return true;
    //             }
    //             else {
    //                 return false;
    //             }
    //         })
    //         // console.log(newArr);
    //        //  console.log(newArr[0].products.pId)

    //          //removing duplicates
    //         const map1=new Map();
    //         let newArrAfterDuplicates=newArr[0].products.filter(function(value,index){
    //         //     console.log(value,newArr[0].products.indexOf(value),index)
    //           //  console.log(value.pId,map1.get(value.pId))
    //              if(map1.get(value.pId)==undefined){
    //                 map1.set(value.pId,1);
    //                  return true;
    //            }
    //              else {
    //                  return false;
    //              }
    //          })
    //    //     console.log(newArrAfterDuplicates)
    //         let newArrFilter=[];
    //         newArrAfterDuplicates.forEach(function(value){
    //              let a=products.filter(function(value2){
    //                 if(value2.id==value.pId){
    //                     return true;
    //                 }
    //                 else {
    //                     return false;
    //                 }
    //             })
    //           //  console.log(a[0])
    //             newArrFilter.push(a[0]);
    //         })
    //         //console.log(newArrFilter);
    //         //removing duplicates
    //         for(let i=0;i<newArrFilter.length;i++){
    //             newArrFilter[i].quantity=newArrAfterDuplicates[i].quantity;
    //         }
           

    //         res.render("cartDetails",{products:newArrFilter})
    //     }
    // })
})

app.post('/incCount',(req,res)=>{
    console.log("In the incCount End Point");
   //console.log(req.body);
   User.find({username:req.session.username}).then(async function(obj){
    let ans;
      for(let i=0;i<obj[0].products.length;i++){
            if(obj[0].products[i].pId==req.body.id){
                ans=i;
                obj[0].products[i].quantity++;
            }
        }
        let arr=obj[0].products;
        console.log(arr);
      User.updateOne({username:req.session.username},{products:arr}).then(function(){
        console.log("success");
        res.end("success")
      })
   })
//    fs.readFile('./db.txt',"utf-8",(err,data)=>{
//       if(err){
//         res.end("Fail to open the file");
//       }
//       else {
//         data =JSON.parse(data);
//         let index=0;
//         let ans;
//         let index2=0;
//             let ans2;
//         data.forEach(function(value){
//                 if(value.username==req.session.username){
//                     ans=index;
//                 }
//                 index++;
//         })
//       //  console.log(data[ans])
//         data[ans].products.forEach(function(value){
            
//             if(value.pId==req.body.id){
//                 ans2=index2;
//             }
//             index2++;
//         })
//         //updating the value of quantity
        
//         data[ans].products[ans2].quantity++;
//         console.log(data[ans].products[ans2])
//         console.log(data);
//         fs.writeFile('./db.txt',JSON.stringify(data),(err)=>{
//             if(err){
//                 res.end("Fail to update value in the file");
//             }
//             else {

//                 res.end("success")

//             }
//         })

//     }
// })
 })
app.post('/decCount',(req,res)=>{
    console.log("In the decCount End Point");
    User.find({username:req.session.username}).then(async function(obj){
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
          User.updateOne({username:req.session.username},{products:arr}).then(function(){
            console.log("success");
            res.end("success")
          })
       })
   //console.log(req.body);
//    fs.readFile('./db.txt',"utf-8",(err,data)=>{
//       if(err){
//         res.end("Fail to open the file");
//       }
//       else {
//         data =JSON.parse(data);
//         let index=0;
//         let ans;
//         let index2=0;
//             let ans2;
//         data.forEach(function(value){
//                 if(value.username==req.session.username){
//                     ans=index;
//                 }
//                 index++;
//         })
//       //  console.log(data[ans])
//         data[ans].products.forEach(function(value){
            
//             if(value.pId==req.body.id){
//                 ans2=index2;
//             }
//             index2++;
//         })
//         //updating the value of quantity
//         if(data[ans].products[ans2].quantity>0){
//             data[ans].products[ans2].quantity--;
//         }
//         console.log(data[ans].products[ans2])
//         console.log(data);
//         fs.writeFile('./db.txt',JSON.stringify(data),(err)=>{
//             if(err){
//                 res.end("Fail to update value in the file");
//             }
//             else {

//                 res.end("success")

//             }
//         })

//     }
// })
})

app.post('/deleteFromCart',(req,res)=>{
    User.find({username:req.session.username}).then(async function(obj){
        let ans;
          for(let i=0;i<obj[0].products.length;i++){
                if(obj[0].products[i].pId==req.body.id){
                    obj[0].products.splice(i,1);
                    // ans=i;
                    // obj[0].products[i].quantity++;
                }
            }
            let arr=obj[0].products;
            console.log(arr);
          User.updateOne({username:req.session.username},{products:arr}).then(function(){
            console.log("success");
            res.end("success")
          })
       })
   
   //console.log(req.body);
//    fs.readFile('./db.txt',"utf-8",(err,data)=>{
//       if(err){
//         res.end("Fail to open the file");
//       }
//       else {
//         data =JSON.parse(data);
//         let index=0;
//         let ans;
//         let index2=0;
//             let ans2;
//         data.forEach(function(value){
//                 if(value.username==req.session.username){
//                     ans=index;
//                 }
//                 index++;
//         })
//       //  console.log(data[ans])
//         data[ans].products.forEach(function(value){
            
//             if(value.pId==req.body.id){
//                 ans2=index2;
//             }
//             index2++;
//         })
//         //updating the value of quantity
//         // if(data[ans].products[ans2].quantity>0){
//         //     data[ans].products[ans2].quantity--;
//         // }
//         data[ans].products.splice(ans2,1);
        
//        // console.log(data[ans].products[ans2])
//        // console.log(data);
//         fs.writeFile('./db.txt',JSON.stringify(data),(err)=>{
//             if(err){
//                 res.end("Fail to update value in the file");
//             }
//             else {

//                 res.end("success")
//             }
//         })

//     }
// })
})
app.post('/getDetails',(req,res)=>{
    Product.find({id:req.body.id}).then(async function(obj){
           res.json(obj[0]);
       })
})
const port=3000
app.listen(port,()=>{
    console.log("App Running at port http://localhost:"+port);
})