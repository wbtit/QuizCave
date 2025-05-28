import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";

export const connectDB = async () => {
    console.log("MONGO:","Connecting to database...");
    try {
        const mongo = await mongoose.connect(`${process.env.MONGO_URI}`)
        console.log("MONGO:",`Database connected: ${mongo.connection?.name}`);
    } catch (error) {
        console.error(error.message,"Database connection failed");
        console.error("MONGO:","Database connection failed");
    }
}