const  jwt= require("jsonwebtoken");
const User= require("../models/Users/User");
require("dotenv").config();
const isLoggedIn = (req,resp,next)=>{
   console.log("isLoggedIn Executed");
   //Fetch token from request
   const token= req.headers.authorization?.split(" ")[1];
   //console.log("Request Object",token);
   //Verify Token
   jwt.verify(token,process.env.JWT_KEY,async (err,decoded) => {
      //if unsuccessfull, then send the error message
      if(err){
         const error= new Error(err?.message);
        next(error);
      }
       //if successfull, then pass the User Object to next path
      else{
         const userId= decoded?.user?.id;
         const user= await User.findById(userId).select("username email role _id");
         //console.log("User:",user);
         req.userAuth = user;
         next();

      }
      
      
   });
   
   
  
   
   
};
module.exports = isLoggedIn;
