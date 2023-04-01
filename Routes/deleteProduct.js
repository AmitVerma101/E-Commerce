const express=require('express');
const multer=require('multer')
const crypto=require('crypto');
const bodyParser = require('body-parser')
const app=express();
require('dotenv').config();
let database = process.env.database;
//const upload = multer({ dest: 'products/' })
app.use(bodyParser.urlencoded({ extended: true }));
const router=express.Router()
const findFunction=require('../Database/find')
const mongo=require('../Database/mongo')
const sql=require('../Database/sql');
router.post('/',async (req,res)=>{
    let id=(req.body.id)
    console.log(req.body)
    console.log(id)
     if(database == 'sql'){
         await sql.deleteProduct(id);
     }
     else {
         await mongo.deleteProduct(id);
     }
    res.end("Record deleted successfully")
})

module.exports=router