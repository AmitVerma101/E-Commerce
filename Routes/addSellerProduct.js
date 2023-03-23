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
     const {name,descMain,Rating,description,warranty,color,RAM}=req.body;
    //  let product = new sellerProduct({name,descMain,Rating,description,warranty,color,RAM,image,username:req.session.username})
    //  await product.save();
     let arr={descMain:descMain,Rating:Rating,description:description,warranty:warranty,color:color,RAM:RAM};
     let val={name:name,image:image,username:req.session.username,id:crypto.randomBytes(3).toString('hex')};
     await mongo.createProduct(val,arr);
    //  let p= new Product({name:name,image:image,username:req.session.username,id:crypto.randomBytes(3).toString('hex')});
    //  await p.save();
    // await Product.updateOne({name:name,username:req.session.username},{$push:{description:arr}})
    console.log("saved successfully");
    res.render("sellerProducts",{username:req.session.username});
})

module.exports=router