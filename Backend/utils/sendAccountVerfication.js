const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

//!Load dotenv into process object
dotenv.config();

const sendAccountVerificationEmail = async(to, verifyToken)=>{
    try {
        //!create transport object
        const transport= nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth:{
                user: process.env.GMAIL_USER,
                pass: process.env.APP_PASSWORD
            }
        });
        //!Create the message to be sent
        const message = {
            to,
            subject: "Account Verification Link",
            html: `
                   <p>You are receiving this email because you (or someone else) have requested to verify your account.</p>
                   <p>Please click on the following link, or paste this into your browser to complete the process:</p>
                   <p>https://localhost:3000/verify-account/${verifyToken}</p>
                   <p>If you did not request this, please ignore this email.</p>`
        };
        //!Send the mail
         const info = await transport.sendMail(message);
         console.log("Email Sent", info.messageId);
    }
    catch(error){
        console.log(error);
        throw new Error("Email sending failed");
    }


};
module.exports = sendAccountVerificationEmail;