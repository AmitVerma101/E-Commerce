function checkAuth(req,res,next){
    if(req.session.isLoggedIn){
        next();
    }
    else {
        res.redirect('/signup');    
    }
}
module.exports=checkAuth;