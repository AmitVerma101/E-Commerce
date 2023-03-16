const mongoose=require('mongoose');


const productSchema= new mongoose.Schema({
    // name:String,
    // username:String,
    // email:String,
    // password:String,
    // isVerified:Boolean,
    // token:String,
    // products:[],
    id:String,
    name:String,
    image:String,
    description:[],
   
})

module.exports= mongoose.model("Product",productSchema);