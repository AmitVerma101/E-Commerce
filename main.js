const express =require('express')
const fs=require('fs')
const bodyParser = require('body-parser')
const app=express();
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
    res.render("home");
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

    //reading the database
    fs.readFile('./db.txt',"utf-8",(err,data)=>{
        let obj=[];
        flag=false;
        if(err){
            res.end("Error Occur while openning the file")
        }
        else {
                if(data.length!==0){
                    obj=JSON.parse(data);
                }
                for(let i=0;i<obj.length;i++){
                    
                    if(obj[i].username==username){
                        console.log("here")
                        flag=true;
                        break;
                    }
                }
                if(flag){
                    res.render("signup",{error:"Username already Exists"});
                    return;
                }
                else {
                    let newObj={name,username,email,password,isVerified:false,token:Date.now(),products:[]};
                    obj.push(newObj);
                    fs.writeFile('./db.txt',JSON.stringify(obj),(err)=>{
                        if(err){
                            res.end("Fail to write in the file");
                        }
                        else {
                            req.session.isLoggedIn=true;
                            req.session.isVerified=false;
                            req.session.username=username;
                           // res.redirect("/result");
                            console.log("Ye chalta h kya")
                            sendMail(req,res,newObj.token);
                            res.end("verify email first");
                        }
                    })
                }
               
                
        }
    })
    console.log(name);
  //  res.end("hello");
})
app.route('/login').get((req,res)=>{
    if(req.session.isLoggedIn==true&&req.session.isVerified){
        res.render("result",{username:req.session.username})
        
    }
    else{
        res.render("login",{error:''});
    }
    
}).post((req,res)=>{
    console.log(req.body);
    let {username,password}=req.body;
    fs.readFile('./db.txt',"utf-8",(err,data)=>{
        let obj=[];
        if(err){
            res.end("Error in opening the file at the login");
        }
        else {
                if(data.length!=0){
                    obj=JSON.parse(data);
                }
                console.log(obj)
                for(let i=0;i<obj.length;i++){
                
                    if(obj[i].username==username&&obj[i].password==password){
                        req.session.isLoggedIn=true;
                        req.session.isVerified=true;
                        req.session.username=username;        
                        res.redirect('/result')
                        return;
                    }
                }
                res.render('login',{error: 'Wrong Username or password'});
        }
    })
    // res.end("Checking your details");
})

app.get('/result',checkAuth,(req,res)=>{
        console.log("Printing the value of the isVerified in the result page"+req.session.isVerified);
        console.log("I am here");
        res.render("result",{username:req.session.username})
    
})
app.get('/logout',(req,res)=>{
    req.session.destroy();
    res.redirect('/');
})

app.get('/products',(req,res)=>{
    req.session.products=-1;
   // console.log(products);
    let obj=products.slice(req.session.products,req.session.products+5);
    console.log(obj);
    // products.forEach(function(value){
    //     console.log(value.id);
    // })
    res.render("products",{product:obj});

})

app.post('/fetchMoreProducts',(req,res)=>{
    req.session.products++;
    console.log(req.session.products);
    res.json(products.slice(req.session.products*5,req.session.products*5+5));
    
})

app.get('/verifyEmail/:token',(req,res)=>{
    const {token}=req.params;
    console.log(token);
    fs.readFile('./db.txt',"utf-8",(err,data)=>{
        if(err){
            res.end("Fail to read the file db.txt");
        }
        else {
            data=JSON.parse(data);
            console.log(data);
            for(let x=0;x<data.length;x++){
                console.log("for loop")
                if(data[x].token==token){

                    req.session.isVerified=true;
                    console.log("Working in the if statement")
                    break;
                }
            }
           // console.log(data);
           console.log(req.session.isVerified);
           console.log("printing in the verifyEmail endpoint"+req.session.isVerified);
           res.redirect('/results')
        }
    })
   
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
    fs.readFile('./db.txt',"utf-8",(err,data)=>{
        if(err){
            res.end("Fail to open the database");
        }
        else {
            data=JSON.parse(data);
            let index=0;
            let email;
            let ans;
            data.forEach(function(value){
                if(value.username==req.session.username){
                    // value.password=req.body.first;
                    ans=index;
                }
                index++;
            })
            data[ans].password=req.body.first;
            email=data[ans].email;
            fs.writeFile("./db.txt",JSON.stringify(data),(err)=>{
                if(err){
                    res.end("Fail to write in the file");
                }
                else {
                    confirmMail(req,res,email);
                    res.end("Password Update successfully");
                }
            })
        }
    })
})
app.get('/forgotPassword',(req,res)=>{
   res.render("forgotPassword",{message:""});
})
app.post('/sendDynamicMail',(req,res)=>{
    fs.readFile('./db.txt',"utf-8",(err,data)=>{
        if(err){
            res.end("Fail to open the file")
        }
        else {
            data=JSON.parse(data);
            let index=0;
            let ans;
            data.forEach(function(value){
                if(value.email==req.body.email){
                    ans=index;
                    console.log(ans);
                }
                index++;
            })


            req.session.isVerified=true;
            req.session.isLoggedIn=true;
            req.session.username=data[ans].username;
            // res.redirect('/updatePassword')
            res.redirect("/changePassword")

        }
    })
    // forgotPassword(req,res,req.body.email);
    // res.render("forgotPassword",{message:"A mail has been sent on your email address"})
    // console.log(req.body.email);
})
// app.post('/updateForgotPassword',(req,res)=>{
//    // console.log(req.body.password,req.body.confirmPassword)
//     console.log("hello")
// })
app.post('/addToCart',(req,res)=>{
    console.log("In add to Cart function")
    let id=JSON.parse(req.body.id)
    fs.readFile('./db.txt',"utf-8",(err,data)=>{
        if(err){
            res.end("Fail to open the file");
        }
        else {
            data=JSON.parse(data);
            for(let i=0;i<data.length;i++){
                console.log("Inside the for loop")
                console.log(id,data[0].id);
                if(data[i].username==req.session.username){
                    console.log("here")
                    let x;
                    for(let j=0;j<data[i].products.length;j++){
                        if(data[i].products[j].pId==id){
                            x=1;
                        }
                    }
                    if(x==undefined){
                    data[i].products.push({pId:id,quantity:1});
                    console.log(data[i].products)
                    }
                    
                    //  data[i].selected=true;
                }
              
            }
           
            fs.writeFile('./db.txt',JSON.stringify(data),(err)=>{
                if(err){
                    res.end("Fail to write in the file");
                }
                console.log("file updated successfully");
                
               
            })
        }
    })
    // console.log(id);
    // console.log(products)
   
    // console.log()

})


app.get('/displayCart',(req,res)=>{
  //  console.log("Inside displayCart function")
    fs.readFile('./db.txt',"utf-8",(err,data)=>{
        if(err){
            res.end("Fail to read the file");
        }
        else {
            data=JSON.parse(data);
            let newArr=data.filter(function(value){
                if(req.session.username==value.username){
                    return true;
                }
                else {
                    return false;
                }
            })
            // console.log(newArr);
           //  console.log(newArr[0].products.pId)

             //removing duplicates
            const map1=new Map();
            let newArrAfterDuplicates=newArr[0].products.filter(function(value,index){
            //     console.log(value,newArr[0].products.indexOf(value),index)
              //  console.log(value.pId,map1.get(value.pId))
                 if(map1.get(value.pId)==undefined){
                    map1.set(value.pId,1);
                     return true;
               }
                 else {
                     return false;
                 }
             })
       //     console.log(newArrAfterDuplicates)
            let newArrFilter=[];
            newArrAfterDuplicates.forEach(function(value){
                 let a=products.filter(function(value2){
                    if(value2.id==value.pId){
                        return true;
                    }
                    else {
                        return false;
                    }
                })
              //  console.log(a[0])
                newArrFilter.push(a[0]);
            })
            //console.log(newArrFilter);
            //removing duplicates
            for(let i=0;i<newArrFilter.length;i++){
                newArrFilter[i].quantity=newArrAfterDuplicates[i].quantity;
            }
           

            res.render("cartDetails",{products:newArrFilter})
        }
    })
})

app.post('/incCount',(req,res)=>{
    console.log("In the incCount End Point");
   //console.log(req.body);
   fs.readFile('./db.txt',"utf-8",(err,data)=>{
      if(err){
        res.end("Fail to open the file");
      }
      else {
        data =JSON.parse(data);
        let index=0;
        let ans;
        let index2=0;
            let ans2;
        data.forEach(function(value){
                if(value.username==req.session.username){
                    ans=index;
                }
                index++;
        })
      //  console.log(data[ans])
        data[ans].products.forEach(function(value){
            
            if(value.pId==req.body.id){
                ans2=index2;
            }
            index2++;
        })
        //updating the value of quantity
        
        data[ans].products[ans2].quantity++;
        console.log(data[ans].products[ans2])
        console.log(data);
        fs.writeFile('./db.txt',JSON.stringify(data),(err)=>{
            if(err){
                res.end("Fail to update value in the file");
            }
            else {

                res.end("success")

            }
        })

    }
})
})
app.post('/decCount',(req,res)=>{
    console.log("In the incCount End Point");
   //console.log(req.body);
   fs.readFile('./db.txt',"utf-8",(err,data)=>{
      if(err){
        res.end("Fail to open the file");
      }
      else {
        data =JSON.parse(data);
        let index=0;
        let ans;
        let index2=0;
            let ans2;
        data.forEach(function(value){
                if(value.username==req.session.username){
                    ans=index;
                }
                index++;
        })
      //  console.log(data[ans])
        data[ans].products.forEach(function(value){
            
            if(value.pId==req.body.id){
                ans2=index2;
            }
            index2++;
        })
        //updating the value of quantity
        if(data[ans].products[ans2].quantity>0){
            data[ans].products[ans2].quantity--;
        }
        console.log(data[ans].products[ans2])
        console.log(data);
        fs.writeFile('./db.txt',JSON.stringify(data),(err)=>{
            if(err){
                res.end("Fail to update value in the file");
            }
            else {

                res.end("success")

            }
        })

    }
})
})

app.post('/deleteFromCart',(req,res)=>{
    console.log("In the deleteFromCart");
   //console.log(req.body);
   fs.readFile('./db.txt',"utf-8",(err,data)=>{
      if(err){
        res.end("Fail to open the file");
      }
      else {
        data =JSON.parse(data);
        let index=0;
        let ans;
        let index2=0;
            let ans2;
        data.forEach(function(value){
                if(value.username==req.session.username){
                    ans=index;
                }
                index++;
        })
      //  console.log(data[ans])
        data[ans].products.forEach(function(value){
            
            if(value.pId==req.body.id){
                ans2=index2;
            }
            index2++;
        })
        //updating the value of quantity
        // if(data[ans].products[ans2].quantity>0){
        //     data[ans].products[ans2].quantity--;
        // }
        data[ans].products.splice(ans2,1);
        
       // console.log(data[ans].products[ans2])
       // console.log(data);
        fs.writeFile('./db.txt',JSON.stringify(data),(err)=>{
            if(err){
                res.end("Fail to update value in the file");
            }
            else {

                res.end("success")
            }
        })

    }
})
})

const port=3000
app.listen(port,()=>{
    console.log("App Running at port http://localhost:"+port);
})