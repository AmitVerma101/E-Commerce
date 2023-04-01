const mongoose=require('mongoose');


const orderSchema= new mongoose.Schema({
    id:String,
    username:String,
    sellerName:String,
    productId:String,
    status:Number,
    quantity:Number,
    total:Number

})

module.exports= mongoose.model("Order",orderSchema);