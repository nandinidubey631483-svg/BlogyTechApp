const mongoose=require("mongoose");
require("dotenv").config();
const connectDB= async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Connected successfully to mongodb");
    }catch(error){
        console.log("Connection to mongodb failed:",error.message);
    }
};
module.exports= connectDB; 