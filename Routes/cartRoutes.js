const express = require('express')
const app= express();
const sendMail=require('../middlewares/sendMail')
//const express=require('express');
const User=require('../userSchema');
const router=express.Router()
const mongo=require('../Database/mongo')
const sql=require('../Database/sql');
const cartController = require('../controllers/cartControllers')
require('dotenv').config();
let database = process.env.database

router.post('/addToCart',cartController.addToCart);


//adding the decCount route

router.post('/decCount',cartController.decCount);



//adding the incCount route
router.post('/incCount',cartController.incCount);

//  adding the deleteFromCart route

router.post('/deleteFromCart',cartController.deleteFromCart);


//Adding the placeOrder route

router.post('/placeOrder',cartController.placeOrder)


//adding the displayCart route


router.get('/displayCart',cartController.displayCart)


module.exports=router


