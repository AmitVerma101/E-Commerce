const express = require('express')
const app= express();
const multer=require('multer')
const bodyParser = require('body-parser');
//const express=require('express');
const User=require('../userSchema');
const router=express.Router()
const mongo=require('../Database/mongo')
const sql=require('../Database/sql');
require('dotenv').config();
let database = process.env.database
const upload = multer({ dest: 'products/' })
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("../products"));

const sellerController = require('../controllers/sellerControllers');


//adding the addSellerProduct route

router.get('/sellerLogin',sellerController.sellerLoginGet)
router.post('/sellerLogin',sellerController.sellerLoginPost);


//adding the fetchSellerProducts route

router.get('/fetchSellerProducts',sellerController.fetchSellerProducts);


//adding the addSellerProduct route

router.post('/addSellerProduct',upload.single('image'),sellerController.addSellerProduct)

//adding the deleteProduct route

router.post('/deleteProduct',sellerController.deleteProduct)


//adding the resolveRequest route

router.post('/resolveRequest',sellerController.resolveRequest)

//adding the reject request route

router.post('/rejectRequest',sellerController.rejectRequest)

//adding the sellerOrders route

router.get('/sellerOrders',sellerController.sellerOrders)

  //adding the updateProducts route

  router.post('/updateProduct',upload.single('image'),sellerController.updateProducts)

// adding the sellerLogout route

router.get('/logout',sellerController.logout);


module.exports = router