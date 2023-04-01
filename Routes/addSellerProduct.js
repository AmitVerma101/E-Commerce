const express=require('express');
const multer=require('multer')
const crypto=require('crypto');
const bodyParser = require('body-parser')
const app=express();
const upload = multer({ dest: 'products/' })
app.use(bodyParser.urlencoded({ extended: true }));
const router=express.Router()
//const findFunction=require('../Database/find')
const mongo=require('../Database/mongo')
const sql=require('../Database/sql');
require('dotenv').config();
let database = process.env.database;
router.post('/',upload.single('image'),async (req,res)=>{
    let image=req.file.filename;
     const {name,descMain,Rating,description,warranty,color,RAM,stocks}=req.body;
     let arr={descMain:descMain,Rating:Rating,description:description,warranty:warranty,color:color,RAM:RAM,stocks:stocks};
     let val={name:name,image:image,username:req.session.username,id:crypto.randomBytes(3).toString('hex')};
     if(database == 'sql'){
         await sql.createProduct(val,arr);
     }
     else {
         await mongo.createProduct(val,arr);
     }
    console.log("saved successfully");
    res.render("sellerProducts",{username:req.session.username});
})

module.exports=router