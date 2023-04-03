const express = require('express')
const app= express();
const sellerMail=require('../middlewares/sellerMail')
//const express=require('express');
const User=require('../userSchema');
const router=express.Router()
const mongo=require('../Database/mongo')
const sql=require('../Database/sql');
require('dotenv').config();
let database = process.env.database
const adminController = require('../controllers/adminControllers')

//adding the adminPanel route

router.get('/adminPanel',adminController.adminPanel)

//adding the AddSeller route

router.post('/AddSeller',adminController.AddSeller);
module.exports = router


