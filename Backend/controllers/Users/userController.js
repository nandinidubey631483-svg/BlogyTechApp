const crypto = require("crypto");

//@desc Register new user
//@route POST /api/v1/users/register
//@access public 
const User = require("../../models/Users/User");
const sendEmail= require("../../utils/sendMail");
const sendAccountVerificationEmail= require("../../utils/sendAccountVerfication");
const express=require("express");
const asynchandler= require("express-async-handler");
const bcrypt= require("bcryptjs");
const app=express();


app.use(express.json());

exports.register = asynchandler(
    async (req,resp,next)=>{
    
        const {username,password,email} = req.body;
        const user= await User.findOne({username});
        if(user){
            throw new Error("User Already Exists");
        }
        const newUser= new User({username,email,password
        });
        const salt = await bcrypt.genSalt(10);
        newUser.password = await bcrypt.hash(password,salt);
        await newUser.save();
        console.log("before register resp");
        resp.json({
            status:"success",
            message:"User registered",
            _id:newUser?._id,
            username: newUser?.username,
            email: newUser?.email, //chaining to avoid exception
            role:newUser?.role,
            
        });
        console.log("after register resp");
      

    }
);
      
 //@desc login  user
//@route POST /api/v1/users/login
//@access public 
const generateToken= require("../../utils/generateToken.js");  
exports.login= asynchandler(
    async(req,resp,next)=>{
    
        const {username,password}=req.body;
        const user = await User.findOne({username});
        if(!user){
            throw new Error("Invalid credentials")
        }
        let isMatched= await bcrypt.compare(password,user.password);
        if(!isMatched){
            throw new Error("Invalid credentials")
        }
        user.lastlogin = new Date();
        await user.save();
        console.log("before login");
        resp.json({status:"success",message:"User Loggedin",
            _id:user?._id,
            username:user?.username,
            email: user?.email, //chaining to avoid exception
            role:user?.role,
            token:generateToken(user),});

       
    }
    
);
  
//@desc profile
//@route POST /api/v1/users/profile
//@access private
exports.getProfile =asynchandler(async(req,resp,next) =>{
    console.log(req.userAuth);

    const user= await User.findById(req.userAuth.id)
        .populate({path: " posts",model: "Post"})
        .populate({path:  "following", model: "User"})
        .populate({path:  "followers", model: "User"})
        .populate({path:  "blockedUsers",model: "User"})
        .populate({path:  "profileViewers",model: "User"});


    resp.json({ status: "success", message:"Profile fetched", user,})}
);
//@desc blocking user
//@route PUT /api/v1/users/block/userIdBlock
//@access private
exports.blockUser = asynchandler(async(req,resp,next)=>{
    //!Find the userid to be blocked
        const userIdToBlock = req.params.userIdToBlock;
        //!Check whether the user is present in DB or not
        const userToBlock = await User.findById(userIdToBlock);
        if (!userToBlock) {
            let error = new Error("User to block not foumd!");
            next(error);
            return;
        }
        //!Get the current user id
        const userBlocking = req?.userAuth?._id;
    
        //!Check if it is self blocking
        if (userIdToBlock.toString() === userBlocking.toString()) {
            let error = new Error("Cannot block yourself!");
            next(error);
            return;
        }
    
        //!Get the current user object from DB
        const currentUser = await User.findById(userBlocking);
    
        //!Check whether the userIdToBlock is already blocked
        if (currentUser.blockedUsers.includes(userIdToBlock)) {
            let error = new Error("This user has already been blocked!");
            next(error);
            return;
        }
    
        //!push the user to be blocked in the blockedUsers array
        currentUser.blockedUsers.push(userIdToBlock);
        await currentUser.save();
        resp.json({
            status: "success",
            message: "User blocked successfully",
        });
});
//@desc unblocking user
//@route PUT /api/v1/users/unblock/userIdUnBlock
//@access private
exports.unblockUser = asynchandler(async(req,resp,next)=>{
    //!find the userid to be unblocked
    const userIdToUnBlock = req.params.userIdToUnBlock;
    //!check whether the user is present in DB or not
    const userToUnBlock= await User.findById(userIdToUnBlock);
    if(!userToUnBlock){
        
       let error= new Error("User to Unblock not found,",userToUnBlock);
        next(error);
        return;
    }
    //!find the current user
    const userUnBlocking = req?.userAuth?._id;
    const currentUser= await User.findById(userUnBlocking);
    //!check if user to unblock is already blocked
    if(!currentUser.blockedUsers.includes(userIdToUnBlock)){
        let error = new Error("This user is not  blocked");
        next(error);
        return;
    }
    //!Remove the user from the current user blockedUsers array
    currentUser.blockedUsers=currentUser.blockedUsers.filter((id)=>{
        return id.toString()!== userIdToUnBlock;
    });
    //save to db
    await currentUser.save();
    //!return the response
    resp.json({
        status:"success",
        message: "User Unblocked successfully",
    });
});
//@desc view another user profile
//@route GET /api/v1/users/view-another-profile/:userProfileId
//@access PRIVATE
exports.viewOtherProfile = asynchandler(async(req,resp,next)=>{
    const userProfileId = req.params.userProfileId;
    //todo check whether the user is present in DB or not
    const userProfile= await User.findById(userProfileId);
    if(!userProfile){
        
       let error= new Error("User to view not found,");
        next(error);
        return;
    }
    //todo find the current user
    const userViewingId = req?.userAuth?._id;
    //todo check if user has already viewed  profile of userProfileId
     if(userProfile.profileViewers.includes(userViewingId)){
        let error = new Error("You have already viewed this profile");
        next(error);
        return;
    }
    //todo push the userViewingId into array of userProfile
    userProfile.profileViewers.push(userViewingId);
    //update the DB
    await userProfile.save();
    //return the resp
    resp.json({
        status:"success",
        message:"Profile successfully viewed",
    });
});
//@desc Follow User
//@route PUT /api/v1/users/following/:userIdToFollow
//@access PRIVATE
exports.followingUser = asynchandler(async(req,resp,next)=>{
    //Find the current user id
    let currentUserId= req?.userAuth?._id;
    //find the userid to be follow
    const userIdToFollow = req.params.userIdToFollow;
    //check whether the user is present in DB or not
    const userToFollow= await User.findById(userIdToFollow);
    if(!userToFollow){
        let error= new Error("User to Follow not found,");
        next(error);
        return;
    }
    //Avoid current user following himself
    if(currentUserId.toString() === userIdToFollow.toString()){
        let error= new Error("You Cannot follow yourself");
        next(error);
        return;
    }

    //push the id of userToFollow inside following array of current user
    updatedFollowing= await User.findByIdAndUpdate(
        currentUserId,
        {
            $addToSet: {following: userIdToFollow},
        },
        {new:true}
    );

    //push the current user id into the followers array of userToFollow
    updatedFollowers= await User.findByIdAndUpdate(
        userIdToFollow,
        {
            $addToSet: {followers: currentUserId},
        },
        {new:true}
    );


    //send the response
    resp.json({
        status:"success",
        message:"You have followed the user successfully",
    });
});
//@desc UnFollow User
//@route PUT /api/v1/users/unFollowing/:userIdToUnFollow
//@access PRIVATE
exports.unFollowingUser= asynchandler(async(req,resp,next)=>{
    //Find the current user id
    let currentUserId= req?.userAuth?._id;
    //find the userid to be unfollow
    const userIdToUnFollow = req.params.userIdToUnFollow;
    //check whether the user is present in DB or not
    const userToUnFollow= await User.findById(userIdToUnFollow);
    if(!userToUnFollow){
        let error= new Error("User to Follow not found,");
        next(error);
        return;
    }
    //Avoid current user unfollowing himself
    if(currentUserId.toString() === userIdToUnFollow.toString()){
        let error= new Error("You Cannot unfollow yourself");
        next(error);
        return;
    }
    //check whether the current user has followed userIdToUnfollow or not
    //todo get the currentUser object
    const currentUser = await User.findById(currentUserId);
    if(!currentUser.following.includes(userIdToUnFollow)){
        let error= new Error("You Cannot unfollow the user you did not follow");
        next(error);
        return;
    }
    //Remove the userIdToUnfollow from the following array
    await User.findByIdAndUpdate(
        currentUserId,
        {
            $pull:{following:userIdToUnFollow}
        },
        {new:true}
    );
    //Remove the currentUserId from the followers array 
    await User.findByIdAndUpdate(
        userIdToUnFollow,
        {
            $pull:{followers:currentUserId}
        },
        {new:true}
    );
    //send the response
    resp.json({
        status:"success",
        message:"You have unfollowed the user successfully",
    });
});
//@dsc Forgot password
//@route POST /api/v1/users/forgot-password
//@access public
exports.forgotPassword = asynchandler(async (req,resp,next)=>{
    //!fetch the email
    const email= req.body.email;
    //!find email in the DB
  const userFound =  await User.findOne({ email });
  if(!userFound){
    let error= new Error("This email id is not registered with us");
        next(error);
        return;
 }
 //!Get the reset token
 const resetToken= await userFound.generatePasswordResetToken();
 //!save the changes{ resetToken and expiryTime} to the DB
 await userFound.save();
 sendEmail(email,resetToken);
 //send the response
 resp.json({
        status:"success",
        message:"You have sent  successfully reset password email",
    });




});
//@dsc Reset password
//@route POST /api/v1/users/reset-password/:resetToken
//@access public
exports.resetPassword= asynchandler(async(req,resp,next)=>{
    //get the token from params
    const { resetToken }= req.params;
    //get the pwd
    const {password}= req.body;
    //Convert resetToken into hashed token
    const hashedToken = crypto
           .createHash("sha256")
           .update(resetToken)
           .digest("hex");
    //verify the token with db
    const userFoundPwd= await User.findOne({
         passwordResetToken: hashedToken,
         passwordResetExpires:{$gt:Date.now() }});
    if(!userFoundPwd){
    let error = new Error("Password reset token is invalid or expired");
    next(error);
    return;
    }
    //update the new pwd
    const salt= await bcrypt.genSalt(10);
    userFoundPwd.password = await bcrypt.hash(password,salt);
    userFoundPwd.passwordResetToken = undefined;
    userFoundPwd.passwordResetExpires = undefined;
    //Resave the user
    await userFoundPwd.save();
    resp.json({
        status:"success",
        message:"You have  successfully reset password ",
    });
});
//@dsc send account verification mail
//@route POST /api/v1/users/account-verification-email
//@access private
exports.accountVerificationEmail = asynchandler(async (req,resp,next)=>{
    //Find the current user's email
     let currentUserId= req?.userAuth?._id;

    //Get the current User
    const currentUser= await User.findById(currentUserId);
    if(!currentUser){
        let error = new Error("User not found");
        next(error);
        return;
    }
    //get the token from current user object
    const verifyToken = await currentUser.generateAccountVerificationToken();
    //resave the user
    await currentUser.save();
    //send the verification email
    sendAccountVerificationEmail(currentUser.email, verifyToken);
    resp.json({
        status:"success",
        message:`You have sent successfully verification email ${currentUser.email} `,
    });
});
//@desc Account Token Verification
//@route PUT /api/v1/users/verify-account/:verifyToken
//@access private
exports.verifyAccount = asynchandler(async(req,resp,next)=>{
    //get the token from param
    const {verifyToken} = req.params;
    //convert the token into hashed form
    const cryptoToken = crypto
           .createHash("sha256")
           .update(verifyToken)
           .digest("hex");
    //verify the token with db
    const userFound= await User.findOne({
         accountVerificationToken: cryptoToken,
         accountVerificationExpires:{$gt:Date.now() }});
    if(!userFound){
    let error = new Error("Account token is invalid or expired");
    next(error);
    return;
    }
    userFound.isVerified = true;
    userFound.accountVerificationToken = undefined;
    userFound.accountVerificationExpires = undefined;
    await userFound.save();
    resp.json({
        status:"success",
        message:`You have  successfully verified  `,
    });



    
});