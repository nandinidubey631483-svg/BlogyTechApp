const globalErrorHandler=(error,req,resp,next)=>{
    const status= error?.status?error.status : 500;
    const stack= error?.stack;
    const message=error?.message;
    console.log("error:",error);
    resp.status(status).json({status, message, stack});
};
const notFound=(req,res,next)=>{
    const error = new Error(`Cannot find route ${req.originalUrl}`);
    error.statusCode = 404;
    next(error);
};
module.exports={globalErrorHandler,notFound};