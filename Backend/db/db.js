import mongoose from "mongoose";
import "dotenv/config"

// connect mongodbAtlas
export const dbConnect = async()=>{
    try{
        await mongoose.connect(process.env.DATABASE);
        mongoose.set('debug',true);
        console.log("Database URL:", process.env.DATABASE);
    
    }catch(error){
        console.log({"database not connectd":error});
        process.exit();
    }
};