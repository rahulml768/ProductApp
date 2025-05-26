import { validationResult } from "express-validator";
import { productModel } from "../Model/ProductModel.js";
import { createProducts } from "../Service/productService.js";
import { logger } from "../logger.js";


//add products
export const addProducts =async(req,res,next)=>{
    const error =validationResult(req)
    console.log(req.body)
    if(!error.isEmpty()){
        logger.warn(`Validation errors: ${JSON.stringify(error.array())}`);
        return res.status(400).json({errors:error.array()})
    }
    try{
  const{name,description,price,image} =req.body
  console.log(req.body)
  if(!name || !description ||!price||!image){
    logger.warn("Add product failed: missing fields");
    return res.status(400).json("all fieldsare required")
  }
  const newProduct = await createProducts({name,description,price,image})
  if(!newProduct){
    logger.error("No product created");
    return res.status(404).json({message:"no product created"})
  }
  return res.status(200).json({message:"products created successfully",newProduct})
    }
    catch(err){
        logger.error(`Internal server error: ${err.message}`);
        return res.status(500).json({message:"internal server error"})
        next(err);
    }
}

//getProducts
export const getProduct = async(req,res,next)=>{
    try{
  const allProducts =await productModel.find({})
  if(allProducts.length == 0){
    logger.error("No product found");
    return res.status(404).json({message:"no product found"})
  }
  return res.status(200).json({allProducts})
    }
    catch(err){
        logger.error(`Internal server error: ${err.message}`);
        return res.status(500).json({message:"internal server error"})
    }
}

//update The products
export const updateProducts =async(req,res,next)=>{
    const error =validationResult(req)
    if(!error.isEmpty()){
        return res.status(400).json({errors:error.array()})
    }
    try{
  const productId =req.params.id
  const{name,description,price,image} = req.body
  if(!name || !description ||!price||!image || !productId){
    return res.status(400).json("all fieldsare required")
  }
  const updatedTask = await productModel.findByIdAndUpdate(
    productId,
    {$set:{name,description,price,image}},
    {new:true}
  )
  if(!updatedTask){
    return res.status(404).json({message:"No product is updated"})
  }
     return res.status(200).json({updatedTask})
    }
    catch(err){
        logger.error(`Internal server error: ${err.message}`);
        return res.status(500).json({message:"internal server error"})
    }
}
 
//get  the selected products
export const getSelectedProduct = async(req,res,next)=>{
    const productId = req.params.id
    if(!productId){

        res.status(400).json({message:"productid is required"})
      }
    try{
    const selectedProduct = await productModel.findById(
        productId
    )
    if(!selectedProduct){
        logger.warn("No task has been created with this id")
        return res.status(404).json({message:"No task has been created with this id"})
    }
    return res.status(200).json({selectedProduct})
    
}
catch(err){
    logger.error(`Internal server error: ${err.message}`);
    return res.status(500).json({message:"internal server error"})
}
}

//get the search products
export const searchProduct =async(req,res,next)=>{
    const{query}= req.query
    console.log(query)
    try{
    if(!query){
        return res.status(400).json("search query is required")
    }

    const products = await productModel.find({
        $or:[
            {name:{$regex:query,$options:"i"}},
            {description:{$regex:query,$options:"i"}}
        ]
    })
    if (products.length === 0) {
        return res.status(404).json({message:"No product found"})
    }
    return res.status(200).json({products})
}
catch(err){
    logger.error(`Internal server error: ${err.message}`);
    return res.status(500).json({message:"internal server error"})
}
}