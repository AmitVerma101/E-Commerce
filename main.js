const express =require('express')
const bodyParser = require('body-parser')
const app=express();
const sql = require('mssql');
require("dotenv").config();
console.log("Printing the value of dotenv");
console.log(process.env.database);
const userRoutes = require('./Routes/userRoutes')
const cartRoutes = require('./Routes/cartRoutes');
const adminRoutes = require('./Routes/adminRoutes');
const sellerRoutes = require('./Routes/sellerRoutes')
const mongoose=require('mongoose')

mongoose.connect("mongodb://127.0.0.1:27017/ECommerce").then(function(){
    console.log("connected successfully")
})

app.set('view engine','ejs');
const session=require('express-session');
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
  }))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("products"))

app.use('/',userRoutes);
app.use('/cart',cartRoutes);
app.use('/admin',adminRoutes);
app.use('/seller',sellerRoutes);

app.get('/logout',(req,res)=>{
    if(req.session!=undefined){
        req.session.destroy();
    }
    res.redirect('/');
})


app.get('/results',(req,res)=>{
    console.log("Printing in the results endPoint"+req.session.isVerified);
    res.redirect('/result');
})


app.get('/forgotPassword',(req,res)=>{
   res.render("forgotPassword",{message:""});
})

app.post('/getDetails',(req,res)=>{
    Product.find({id:req.body.id}).then(async function(obj){
           res.json(obj[0]);
       })
})
const port=5000
app.listen(port,()=>{
    console.log("App Running at port http://localhost:"+port);
})
