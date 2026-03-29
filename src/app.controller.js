import express  from "express"
import { env } from '../config/env.service.js'
import { globalErrorHandler } from "./common/index.js"
import { databaseCOnnection } from "./database/index.js"
import authRouter from './modules/auth/auth.controller.js'
import messageRouter from './modules/messages/messages.controller.js'
import userRoutes from './modules/user/user.controller.js'
import cors from 'cors'
import path from 'path'
import {connectRedis } from "./database/redis.js"
import { get, set } from "./database/redis.service.js"
import helmet from 'helmet'
import { ipKeyGenerator, rateLimit } from 'express-rate-limit'
import axios from "axios"
import geoip from 'geoip-lite'
import "./cron.js"




export const bootstrap = async (app) => {
    app.use((req, res, next) => {
        next()
    })


    await connectRedis()

    await set({
        key : "test",
        value:"testen",
        ttl : 60
    })

    app.set('trust proxy', true)
    console.log(await get("test"));

    let getCounteryCode = async(ip)=>{
       let data = await axios.get(`https://ipapi.co/${ip}/json/`)
       return data.data.country_code
    }

    // app.use(rateLimit({
    //     windowMs : 1 * 1000 * 60 ,
    //     limit : async (req,res)=>{
    //         console.log(req.ip);
    //         // let countryCode =await getCounteryCode(req.ip)
    //         let data = geoip.lookup(req.ip)
    //         console.log(data);            
    //         return data.country == "EG" ? 3 : 0
    //     },
    //     message: {status : 500 , message : "Internal server error msg"} ,
    //     statusCode : 200,
    //     handler : (req , res , next) => {
    //         next({status : 500 , message : "Internal server error"})
    //     },
    //     // legacyHeaders : false,
    //     // standardHeaders : "draft-8",
    //     // skipSuccessfulRequests:true,
    //     // skipFailedRequests : true
    // }))

    app.get("/" , (req , res) => {
        res.json({
            msg : "hello"
        })
    })
    
    

    const uploadsPath = path.join(process.cwd(), 'uploads')
    console.log('Serving static files from:', uploadsPath)
    app.use(express.static(uploadsPath))
    app.use(express.static('public'))
    app.use(express.json())

    app.use(express.urlencoded({ extended: false }))

    app.use(helmet())

    app.use(cors({
        origin : "http://localhost:3000",
        methods : ["GET"],
        credentials : true
    }))


    app.use("/upload" , express.static("upload"))
    
    app.use('/auth',authRouter)
    app.use('/messages', messageRouter)
    app.use('/users' , userRoutes)
    await databaseCOnnection()
    app.get('/uploads/:filename', (req, res) => {
        const filename = req.params.filename
        const filePath = path.join(uploadsPath, filename)
        console.log('Fallback: attempting to serve', filePath)
        res.sendFile(filePath, (err) => {
            if (err) {
                console.log('SendFile error:', err.message)
                res.status(404).json({ error: 'File not found', path: filePath })
            }
        })
    })
    app.use('{*dummy}', (req, res) => res.status(404).json('invalid route'))
    app.use(globalErrorHandler)
    app.listen(env.port, () => {
        console.log('server is running on port 3000');
    })
}
