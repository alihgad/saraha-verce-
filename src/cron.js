import cron from 'node-cron';
import {  userModel } from "./database/index.js";

console.log("cron file");

cron.schedule(' * * * * *', async() => {
    let users = await userModel.deleteMany({ isVerfied : false })    
});