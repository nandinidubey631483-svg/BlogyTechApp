const User= require("../models/Users/User");
const isAccountVerfied= async(req,resp,next)=>{
    try{
        //find user by id
        const currentUser = await User.findById(req.userAuth._id);
        //check whether the user is verified
        if(currentUser.isVerified){
            
        console.log("isAccountVerified executed");
            next();

        }else{
            resp.status(401).json({message:"account not verified"});
        }


    }catch(error){
        resp.status(500).json({message:"Server error",error});
    }
};
module.exports=isAccountVerfied;