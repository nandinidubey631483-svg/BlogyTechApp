const express= require("express");
const{register,login,getProfile,blockUser,unblockUser,viewOtherProfile,followingUser,unFollowingUser,forgotPassword,resetPassword,accountVerificationEmail,verifyAccount}= require("../../controllers/Users/userController");
const isLoggedIn = require("../../middlewares/isLoggedIn");
const usersRouter = express.Router();
//!Register Route
usersRouter.post("/register",register);
//!Login Route
usersRouter.post("/login",login);

//!Profile Route
usersRouter.get("/profile",isLoggedIn, getProfile);

//!Block User
usersRouter.put("/block/:userIdToBlock",isLoggedIn, blockUser);

//!Unblock User
usersRouter.put("/unblock/:userIdToUnBlock",isLoggedIn,unblockUser);
//!view another users profile
usersRouter.get("/view-other-profile/:userProfileId",isLoggedIn,viewOtherProfile);
//!following user
usersRouter.put("/following/:userIdToFollow",isLoggedIn,followingUser);
//!unfollowing user
usersRouter.put("/unFollowing/:userIdToUnFollow",isLoggedIn,unFollowingUser);
//!Forgot password route
usersRouter.post("/forgot-password",forgotPassword);
//!Reset password route
usersRouter.post("/reset-password/:resetToken",resetPassword);

//!account verification route
usersRouter.post("/account-verification-email",isLoggedIn,accountVerificationEmail);
//!account token verification route
usersRouter.put("/verify-account/:verifyToken",isLoggedIn,verifyAccount);






module.exports = usersRouter;



