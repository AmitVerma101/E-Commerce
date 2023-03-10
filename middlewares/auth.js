function checkAuth(req,res,next){
   // console.log(req);
    console.log("Printing the value of the isVerified value in the auth.js file "+req.session.isVerified);
    console.log(req.session.isLoggedIn);
    if(req.session.isLoggedIn&&req.session.isVerified){
        next();
    
    }
    else if(req.session.isVerified==false){
        res.end("Verify the mail first to access the website");
    }
    else {
        res.render('login',{error:'Login before Checking the result page'});
    }
}
module.exports=checkAuth;