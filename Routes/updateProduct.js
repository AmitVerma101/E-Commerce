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
router.post('/',upload.single('image'),async (req,res)=>{
    let image=req.file.filename;
    let {id,name,descMain,Rating,description,warranty,color,RAM}=req.body;
    let arr={descMain,Rating,description,warranty,color,RAM}
    console.log('consoling here');
    console.log(id,name,image,arr);
    console.log(typeof name)
await mongo.updateSellerProduct(id,name,image,arr)

   res.render("sellerProducts",{username:req.session.username})
})

module.exports=router