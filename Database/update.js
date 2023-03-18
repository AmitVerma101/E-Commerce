const User=require('../userSchema');
async function searchQuery(val1,val2,val3,val4){
   
    try{
         await  User.updateOne({[val1]:val2},{[val3]:val4})
       
    }
    catch(err){
        console.log("Error occur Database cant be opened")
    }
   console.log("after the database query")
}
module.exports=searchQuery;