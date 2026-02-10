
import mongoose from "mongoose";
import { env } from "../../config/index.js";

console.log(env.mongoURL);

export const databaseCOnnection = async () => {
    await mongoose.connect(env.mongoURL).then(() => {
        console.log("Connected to database")
    }).catch((error) => {
        console.log(error)
    });
}