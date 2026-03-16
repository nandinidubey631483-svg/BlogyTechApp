const express= require("express");
const {createComment,deleteComment,updateComment,getAllComments} = require("../../controllers/Comments/commentsController");
const isLoggedIn= require("../../middlewares/isLoggedIn");
const commentsRouter = express.Router();
//!Create Category  Route
commentsRouter.post("/:postId",isLoggedIn,createComment);
//!Delete Category  Route
commentsRouter.delete("/:id",isLoggedIn,deleteComment);
//!Update Category  Route
commentsRouter.put("/:id",isLoggedIn,updateComment);
//!Get Category  Route
commentsRouter.get("/",getAllComments);
module.exports=commentsRouter;