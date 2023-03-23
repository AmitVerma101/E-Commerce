const express=require('express');
const multer=require('multer')
const crypto=require('crypto');
const bodyParser = require('body-parser')
const app=express();
const upload = multer({ dest: 'products/' })
app.use(bodyParser.urlencoded({ extended: true }));
const router=express.Router()
const findFunction=require('../Database/find')
const mongo=require('../Database/mongo')
router.post('/',async (req,res)=>{
    let id=(req.body.id)
    console.log(req.body)
    console.log(id)
     
    await mongo.deleteProduct(id);
    res.end("Record deleted successfully")
})

module.exports=router