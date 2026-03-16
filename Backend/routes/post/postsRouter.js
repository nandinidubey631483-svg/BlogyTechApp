const express= require("express");
const {createPost,getAllPosts,getPost,deletePost,updatePost,likePost,dislikePost,clapPost,schedulePost}= require("../../controllers/posts/postController");
const isLoggedIn= require("../../middlewares/isLoggedIn");
const isAccountVerfied= require("../../middlewares/isVerified");
const postsRouter= express.Router();
const multer= require("multer");
const storage= require("../../utils/fileUploads");

const upload= multer({storage});

//!Create POST router
postsRouter.post("/",isLoggedIn,upload.single("file"), createPost);

//!get all Posts  Route
postsRouter.get("/",isLoggedIn,getAllPosts);
//!get single Post  Route
postsRouter.get("/:id",getPost);
//!delete Post  Route
postsRouter.delete("/:id",isLoggedIn,deletePost);
//!update Post  Route
postsRouter.put("/:id",isLoggedIn,updatePost);
//!like post  Route
postsRouter.put("/like/:postId",isLoggedIn,likePost);
//!dislike post  Route
postsRouter.put("/dislike/:postId",isLoggedIn,dislikePost);
 //!claps post  Route
postsRouter.put("/claps/:postId",isLoggedIn,clapPost);
//!schedule post  Route
postsRouter.put("/schedule/:postId",isLoggedIn,schedulePost);


module.exports = postsRouter;
