const User=require('../productSchema');
async function searchQuery(val1,val2,val3,val4){
    console.log(User);
    // console.log("In the find function",val);
    if(val3==undefined&&val4==undefined){
        try{
            let obj = await  User.find({}).skip(val1*5).limit(val2)
            console.log("printing obj")
            console.log(obj);
            return obj;
        }
        catch(err){
            console.log("Error occur Database cant be opened")
        }
    }
    else {
        try{
            let obj = await  User.find({[val3]:[val4]}).skip(val1*5).limit(val2)
            console.log("printing obj")
            console.log(obj);
            return obj;
        }
        catch(err){
            console.log("Error occur Database cant be opened")
        }
    }
   console.log("after the database query")
}
module.exports=searchQuery;