const express = require('express')
const app= express();
const sendMail=require('../middlewares/sendMail')
//const express=require('express');
const User=require('../userSchema');
const router=express.Router()
const mongo=require('../Database/mongo')
const sql=require('../Database/sql');
require('dotenv').config();
const userController= require('../controllers/userControllers')
let database = process.env.database



router.get('/',userController.home);


// creating a route for signup

router.route('/signup')
.get(userController.signupGet)
.post(userController.signupPost);


     //login route

     router.route('/login').get(userController.loginGet).post(userController.loginPost)


        //route for products 

        router.get('/products',userController.products)


        //fetch more products route

        router.post('/fetchMoreProducts',userController.fetchMoreProducts)



        //adding the getDetails route

        router.post('/getDetails',userController.getDetails)


        //adding the verify email route

        router.get('/verifyEmail/:token',userController.verifyEmail);

        //adding the showOrder route


       
        router.get('/showOrders',userController.showOrders)
        

        //send dynamic mail route

        router.post('/sendDynamicMail',userController.sendDynamicMail)


              //adding the changePassword route 
              router.get('/changePassword',userController.changePassword);

              //adding the updatePassword route

              router.post('/updatePassword',userController.updatePassword)
 
module.exports = router;