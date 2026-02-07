const isAdmin = (req,res,next) =>{
    if(req.user.role !== "admin"){
        res.status(403).json({
            isSuccess: false,
            message: "access denied. admin access only"
        })
    }
    next();
}

module.exports = {isAdmin}