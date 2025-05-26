import express from "express"
import { getProduct,addProducts,getSelectedProduct,searchProduct,updateProducts } from "../controller/productController.js"
import { body } from "express-validator"


export const productRoutes = express.Router()

productRoutes.post("/products",[
    body("name").isString().isLength().withMessage("name should be minimum 3 charater long"),
    body("description").isLength().isString().withMessage("description shoul be minium 3 character long"),
    body("price").isNumeric().withMessage("price should be numeric"),
    body("image").isURL().withMessage("image shoudl be in url form")
],addProducts);

productRoutes.put("/products/:id",[
    body("name").isString().isLength().withMessage("name should be minimum 3 charater long"),
    body("description").isLength().isString().withMessage("description shoul be minium 3 character long"),
    body("price").isNumeric().withMessage("price should be numeric"),
    body("image").isURL().withMessage("image shoudl be in url form")
],updateProducts);

productRoutes.get("/products",getProduct)
productRoutes.get("/products/search",searchProduct)

productRoutes.get("/products/:id",getSelectedProduct)

