import express from "express"
import cors from "cors"
import { productRoutes } from "./Routes/productRoutes.js";
import "dotenv/config"
import { dbConnect } from "./db/db.js";
import {logger} from "./logger.js"

export const app =express();
//inbuilt middlewarrs
app.use(express.json())

app.use(express.urlencoded({extended:true}))
app.use(cors());
dbConnect();

app.get("/",(req,res)=>{
    logger.info("home accesed")
    res.send("hello world")
});

//connect with routes
app.use("/api",productRoutes)