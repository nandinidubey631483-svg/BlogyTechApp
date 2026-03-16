const cloudinary = require("cloudinary").v2;
const {CloudinaryStorage}= require("multer-storage-cloudinary");
require("dotenv").config();
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINNARY_API_KEY,
    api_secret: process.env.CLOUDINNARY_API_SECRET,
    verbose:true,
});
const storage= new CloudinaryStorage({
    cloudinary,
    params: {
   folder: "BlogyTechApp",
   allowed_formats: ["jpg","png","jpeg"],
   transformation:[{width:500,height:500,crop:"limit"}]
}
});
module.exports= storage;
