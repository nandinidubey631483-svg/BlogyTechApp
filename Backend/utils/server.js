const express= require("express");
const sendEmail= require("./sendMail");
const dotenv= require("dotenv");
const userRouter = require("../routes/users/usersRouter");
const categoriesRouter = require("../routes/categories/categoriesRouter");
const postsRouter = require("../routes/post/postsRouter");
const commentsRouter = require("../routes/comments/commentsRouter");
const {globalErrorHandler,notFound}= require("../middlewares/globalErrorHandlers");

const connectDB = require("../config/database");

//!Create an exxpress app
//sendEmail("nandinidubey631483@gmail.com","HelloWelcome123");
const app = express();
app.use(express.json());
//!Connect to DB
connectDB();
//!Setup the Router
app.use("/api/v1/users",userRouter);
//!Setup the category router
app.use("/api/v1/categories",categoriesRouter);
//!Setup the post router
app.use("/api/v1/posts",postsRouter);
//!Setup the comment router
app.use("/api/v1/comments",commentsRouter);

//!Default Router
app.use(notFound);
//!Setup the global error handler
app.use(globalErrorHandler);
//! load the environment variable
dotenv.config();
const PORT= process.env.PORT || 9080;
app.listen(PORT,()=>{
    console.log(`Server started at ${PORT}`);
});