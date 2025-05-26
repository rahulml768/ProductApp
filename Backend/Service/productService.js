import { productModel } from "../Model/ProductModel.js";

//create service for add the products
export const createProducts = async({name,description,price,image})=>{
    try{
  const product = await productModel.create({name,description,price,image})
  return product;
    }
    catch(err){
        console.log(err)
        throw new Error("failed to create property")
    }
}
