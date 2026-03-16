const jwt = require("jsonwebtoken");
const generateToken = (user)=>{
    const payLoad = {
        user:{
            id: user._id,
        },
    };
    const token = jwt.sign(payLoad,process.env.JWT_KEY,{expiresIn:3600});
    return token;
};
module.exports= generateToken;