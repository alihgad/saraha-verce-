
import mongoose from "mongoose";
import { env } from "../../config/index.js";

console.log(env.mongoURL_PROD);

export const databaseCOnnection = async () => {
    await mongoose.connect(env.mongoURL_PROD).then(() => {
        console.log("Connected to database")
    }).catch((error) => {
        console.log(error)
    });
}