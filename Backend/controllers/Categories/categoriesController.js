const Category= require("../../models/Categories/category");
const asyncHandler = require("express-async-handler");
//@desc Create new Category
//@route POST /api/v1/categories
//@access private 
exports.createCategory = asyncHandler(
    async(req,resp,next)=>{
        const { name }= req.body;
      const isCategoryPresent= await Category.findOne({name});
      if(isCategoryPresent){
        throw new Error("Category already existing");
      }
    const category= await Category.create({
        name:name,
        author:req?.userAuth?._id,
        
    });
  }
);
//@desc get all Category
//@route GET /api/v1/categories
//@access public
exports.getAllCategories= asyncHandler(async(req,resp)=>{
 const allCategories=await Category.find({}).populate({
  path:"posts",
  model: "Post",
  
 });
 resp.status(201).json({
  status:"success",
  message:"All Categories successfully fetched",
  allCategories
 });
});
//@desc delete single Category
//@route DELETE /api/v1/categories/:id
//@access private
exports.deleteCategory= asyncHandler(async(req,resp)=>{
  const catId= req.params.id;
  await Category.findByIdAndDelete(catId);
  resp.status(201).json({
  status:"success",
  message:"Category deleted successfully "});
}
);
//@desc update single Category
//@route put /api/v1/categories/:id
//@access private
exports.updateCategory= asyncHandler(async(req,resp)=>{
  const catId= req.params.id;
  const name= req.body.name;
  const updatedCategory=await Category.findByIdAndUpdate(catId,{name:name},{new:true, runValidators:true});
  resp.status(201).json({
  status:"success",
  message:"Category updated successfully ",
  updatedCategory }
);
}
);
