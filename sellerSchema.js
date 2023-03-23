const mongoose=require('mongoose');


const sellerSchema= new mongoose.Schema({
    name:String,
    username:String,
    email:String,
    password:String,
    

})

module.exports= mongoose.model("Seller",sellerSchema);