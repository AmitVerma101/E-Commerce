const User=require('../userSchema');
async function searchQuery(val1,val2,val3){
   
    try{
         await  User.updateOne({[val1]:val2},{$push:{products:{pId:[val3][0],quantity:1}}})
       
    }
    catch(err){
        console.log("Error occur Database cant be opened")
    }
   console.log("after the database query")
}
module.exports=searchQuery;