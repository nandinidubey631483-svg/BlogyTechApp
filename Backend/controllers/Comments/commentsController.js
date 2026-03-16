const asyncHandler = require("express-async-handler");
const Post= require("../../models/Post/Post");
const Comments= require("../../models/Comments/comment");
//@desc create a New Comment
//@route POST /api/v1/comments/:postId
//@access private
exports.createComment= asyncHandler(
    async(req,resp)=>{
        //get the payload
        const{ message }=req.body;
        //get the post id
        const postId= req.params.postId;
        //create the comment
        const comment= await Comments.create({
            message,
            author:req.userAuth?._id,
            postId
        });
        //associate comment with post
        await Post.findByIdAndUpdate(
            postId,
            {
                $push:{comments:comment._id},
            },
            {new:true}
        );
        resp.status(201).json({
            status:"success",
            message:"Comment successfully created",
            comment,
        });
        
    }
);
//@desc delete a  Comment
//@route DELETE /api/v1/comments/:postId
//@access private
exports.deleteComment = asyncHandler(
    async(req,resp)=>{
    const commentId = req.params.id;
    const deletedComment= await Comments.findByIdAndDelete(commentId);
    resp.status(201).json({
        status:"success",
        message: "Comment successfully deleted",
        deletedComment
    });
});
//@desc update a  Comment
//@route PUT /api/v1/comments/:postId
//@access private
exports.updateComment = asyncHandler(
    async(req,resp)=>{
   
    const updatedComment= await Comments.findByIdAndUpdate(
          req.params.id,
        {
            message:req.body.message,
        },
        {new:true,
        runValidators:true}
    );
    resp.status(201).json({
        status:"success",
        message: "Comment successfully updated",
        updatedComment
    });
});
//@desc get all comments
//@route GET /api/v1/comments
//@access public
exports.getAllComments= asyncHandler(async(req,resp)=>{
  //fetch all the posts
 const allComments=await Comments.find({});
 //send the response
 resp.status(201).json({
  status:"success",
  message:"All Categories successfully fetched",
  allComments
 });
});