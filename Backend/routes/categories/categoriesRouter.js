const express= require("express");
const {createCategory,getAllCategories,deleteCategory,updateCategory} = require("../../controllers/Categories/categoriesController");
const isLoggedIn= require("../../middlewares/isLoggedIn");
const categoriesRouter = express.Router();
//!Create Category  Route
categoriesRouter.post("/",isLoggedIn,createCategory);
//!get all Category  Route
categoriesRouter.get("/",getAllCategories);
module.exports = categoriesRouter;
//!delete single category
categoriesRouter.delete("/:id",isLoggedIn,deleteCategory);
//!update single category
categoriesRouter.put("/:id",isLoggedIn,updateCategory);