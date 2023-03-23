const mongoose=require('mongoose');


const productSchema= new mongoose.Schema({
  
    id:String,
    name:String,
    image:String,
    description:[],
    username:String
})

module.exports= mongoose.model("Product",productSchema);