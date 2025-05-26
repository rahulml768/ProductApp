import mongoose from "mongoose"

//product schema
const productSchema = mongoose.Schema({
    name:{
        type:String,
        required:true,
        minlength:[3,"product should be min 3 character length"]
    },
    description:{
        type:String,
        minlength:[3,"product should be min 3 character length"]
    },
    price:{
        type:Number,
        required:true,
    },
    image:{
        type:String
    }
})
//product model
export const productModel = mongoose.model("products",productSchema)