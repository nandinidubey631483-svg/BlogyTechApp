const asyncHandler= require("express-async-handler");
const Post= require("../../models/Post/Post");
const User= require("../../models/Users/User");
const Category= require("../../models/Categories/category");
//@desc Create a new post
//@route POST /api/v1/posts
//access private
exports.createPost=asyncHandler(async(req,resp,next)=>{
  
  console.log("FILE:", req.file);

  if(!req.file){
    throw new Error("File not uploaded");
  }

  resp.json({
    message:"file uploaded",
    file:req.file
  });

 
  //get the payload
  // const {title,content,categoryId}= req.body;


  // //check if the post is present
  //  const postFound=await Post.findOne({title});
  //  if(postFound){
  //   let error=new Error("Post already existing");
  //   next(error);
  //   return;
  //  }


  // //create post object 
  // const post=await Post.create({title,content,category:categoryId,author:req?.userAuth?._id}) ;

  // //update category by adding post in it
  // const category=await Category.findByIdAndUpdate(
  //   categoryId,
  //   {$push:{posts:post._id}},
  //   {new:true}
  // );

  // //update user by adding post in it
  //  const user=await User.findByIdAndUpdate(
  //   req?.userAuth?._id,
  //   {$push:{posts:post._id}},
  //   {new:true}
  // );


  // //send the response
  // resp.json({
  //   status:"success",
  //   message :"Post created successfully",
  //   post,
  //   user,
  //   category

  // });
  

});
//@desc get all posts
//@route GET /api/v1/posts
//@access private
exports.getAllPosts = asyncHandler(async (req, resp) => {
  //Get the current user
  const currentUserId= req.userAuth._id;

  //Get the current time
  const currentDateTime = new Date();


  //get all those users who have blocked the current user
  const usersBlockingCurrentUser= await User.find({
    blockedUsers:currentUserId,
  });

  //extract the ids of the users who have blocked the current user
  const blockingUsersIds=usersBlockingCurrentUser.map((userObj)=> userObj._id);

  //condition for checking schedule time
  const query = {
    author: { $nin: blockingUsersIds }, 
    $or:[
      {
        scheduledPublished:{$lte:currentDateTime},
        scheduledPublished:null,
      },
    ],
  };


  //find posts whose author not in blockingUsersIds
    const allPosts = await Post.find(query).populate({
      path: "author",
      model: "User",
      select: "email username role",
    });


  resp.status(200).json({ 
   status:"success",
   blockingUsersIds,
   allPosts
 });

});

//@desc single posts
//@route GET /api/v1/posts/:id
//@access private
exports.getPost= asyncHandler(async(req,resp)=>{
  //get the id
  const postId= req.params.id;
  //fetch the post corresponding to this id
  const post = await Post.findById(postId);
  if(post){
    resp.json({
    status:"success",
    message:"All Categories successfully fetched",
     post
 });

  }
  else{
   resp.json({
    status:"success",
    message:"No post found",
     
 });
  }
});
//@desc delete post
//@route DELETE /api/v1/posts/:id
//@access private
exports.deletePost= asyncHandler(async(req,resp)=>{
  //get the id
  const postId= req.params.id;
  //delete this post from the db
  const deletedPost=await Post.findByIdAndDelete(postId);
  //send the response
  resp.json({
    status: "success",
    message: "Post successfully deleted",
    deletedPost
  });
});
//@desc update post
//@route PUT /api/v1/posts/:id
//@access private
exports.updatePost= asyncHandler(async(req,resp)=>{
  //get the id
  const postId= req.params.id;
  //get the post object from req
  const post = req.body;
  //update this post in the DB
  const updatedPost=await Post.findByIdAndUpdate(
    postId,
    post,
    {new:true,runValidators:true});
    //send the response
    resp.json({
      status:"success",
      message:"Post successfully updated",
      updatedPost
    });
});
//@desc like a post
//@route PUT /api/v1/posts/like/:postId
//@access private
exports.likePost= asyncHandler(async(req,resp,next)=>{
  //fetch the post id
  const {postId}= req.params;
  //get the current user
  const currentUserId= req.userAuth._id;
  //search the post
  const post= await Post.findById(postId);
  if(!post){
    let error = new Error("Post not found");
    next(error);
    return;
  }
  //add the currentUserId to likes array
  await Post.findByIdAndUpdate(
    postId,
    {$addToSet:{likes:currentUserId}},
    {new:true}
  );
  //remove the currentUserId from dislikes array
  post.dislikes= post.dislikes.filter(
    (userId)=>userId.toString()!== currentUserId.toString()
);
//resave the post 
await post.save();
//send the response
resp.json({
      status:"success",
      message:"Post successfully updated",
      
    });



});
//@desc dislike a post
//@route PUT /api/v1/posts/dislike/:postId
//@access private
exports.dislikePost= asyncHandler(async(req,resp,next)=>{
  //fetch the post id
  const {postId}= req.params;
  //get the current user
  const currentUserId= req.userAuth._id;
  //search the post
  const post= await Post.findById(postId);
  if(!post){
    let error = new Error("Post not found");
    next(error);
    return;
  }
  //add the currentUserId to dislikes array
  await Post.findByIdAndUpdate(
    postId,
    {$addToSet:{dislikes:currentUserId}},
    {new:true}
  );
  //remove the currentUserId from likes array
  post.likes= post.likes.filter(
    (userId)=>userId.toString()!== currentUserId.toString()
);
//resave the post 
await post.save();
//send the response
resp.json({
      status:"success",
      message:"Post successfully updated",
      
    });
});
//@desc clap a post
//@route PUT /api/v1/posts/claps/:postId
//@access private
exports.clapPost = asyncHandler(async(req,resp,next)=>{
  //Get the id of the post
  const {postId} = req.params;
  //Search the post
  const post = await Post.findById(postId);
  if(!post){
    let error = new Error("Post not found");
    next(error);
    return;

  }
  //implement claps
  const updatedPost= await Post.findByIdAndUpdate(postId,
    {$inc:{claps:1}},
    {new:true}

  );
  //send the response
  resp.json({
      status:"success",
      message:"Post claps successfully updated",
      updatedPost

      
    });
});
//@desc schedule a post
//@route PUT /api/v1/posts/schedule/:postId
//@access private
exports.schedulePost = asyncHandler(async(req,resp,next)=>{
  //get the data
  const {postId}= req.params;
  const {scheduledPublish}= req.body;
  //Check if postId and scheduledPublish are present
  if(!postId || !scheduledPublish){
    let error = new Error("postId and schedulePublish are required");
    next(error);
    return;

  }
  //find the post from DB
  const post = await Post.findById(postId);
  if(!post){
    let error = new Error("Post not found");
    next(error);
    return;

  }
  //Check if the cuurentUser is the author
  if(post.author.toString()!= req.userAuth._id.toString()){
     let error = new Error("You can schedule only your posts");
    next(error);
    return;

  }
  const scheduleDate = new Date(scheduledPublish);
  const currentDate = new Date();
  if(scheduleDate<currentDate){
    let error = new Error("Scheduled date cannot be past days");
    next(error);
    return;

  }
  //await Post.findByIdAndUpdate(postId,{ scheduledPublished : scheduleDate},{new:true});
  post.scheduledPublished=scheduleDate;
  await post.save();
  //send the response
  resp.json({
      status:"success",
      message:"Post scheduled successfully updated",
      post

      
    });
});
