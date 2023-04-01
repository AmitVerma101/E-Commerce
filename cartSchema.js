const mongoose=require('mongoose');
//const { Int } = require('mssql');


const cartSchema= new mongoose.Schema({
  
    username:String,
    pId:String,
    quantity:Number
})

module.exports= mongoose.model("Cart",cartSchema);