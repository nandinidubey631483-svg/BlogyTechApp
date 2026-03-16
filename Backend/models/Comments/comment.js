const mongoose = require("mongoose");
const commentsSchema = new mongoose.Schema({
    message:{
        type:String,
        required:true,
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:"true",
    },
    postId:{
           type:mongoose.Schema.Types.ObjectId,
           ref:"Post", 
           required:true,
    },
},
{timestamps:true,}

    


);
//!convert schema to model
const Comments= mongoose.model("Comments",commentsSchema);
module.exports= Comments;
