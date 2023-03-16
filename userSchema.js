const mongoose=require('mongoose');


const userSchema= new mongoose.Schema({
    name:String,
    username:String,
    email:String,
    password:String,
    isVerified:Boolean,
    token:String,
    products:[]

})

module.exports= mongoose.model("User",userSchema);