import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";

export const connectDB = async () => {
    try {
        const mongo = await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`)
        console.log("MONGO:",`Database connected: ${mongo.connection?.name}`);
    } catch (error) {
        console.error("MONGO:","Database connection failed");
    }
}