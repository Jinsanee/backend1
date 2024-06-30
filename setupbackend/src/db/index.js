import mongoose from "mongoose";
import { DBname } from "../constants.js";


const connectDB = async() => {
    try {
    const connection = await mongoose.connect(`${process.env.MONGODB}/ ${DBname}`)
    console.log("connection")
    } catch (error) {
        console.error("connection error in DB folder", error)
        process.exit(1)
    }
}


export default connectDB
