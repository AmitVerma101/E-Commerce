// const mongoose=require('mongoose')
// mongoose.connect("mongodb://127.0.0.1:27017/ECommerce").then(function(){
//     console.log("connected successfully")
// })
const User=require('../userSchema');
async function searchQuery(val1,val2){
    console.log(User);
   
    try{
        let obj = await User.find({[val1]:val2})
        console.log("printing obj")
        console.log(obj);
        return obj;
    }
    catch(err){
        console.log("Error occur Database cant be opened")
    }
   console.log("after the database query")
}
module.exports=searchQuery;

