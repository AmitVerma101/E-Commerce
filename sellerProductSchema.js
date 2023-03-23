const mongoose=require('mongoose');


const sellerProductSchema= new mongoose.Schema({
   username:String,
   name:String,
   image:String,
   descMain:String,
   rating:Number,
   description:String,
   warranty:String,
   color:String,
   ram:String
})

module.exports= mongoose.model("sellerProduct",sellerProductSchema);