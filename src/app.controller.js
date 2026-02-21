import express from "express"
import { env } from '../config/env.service.js'
import { globalErrorHandler } from "./common/index.js"
import { databaseCOnnection } from "./database/index.js"
import authRouter from './modules/auth/auth.controller.js'
import cors from 'cors'

export const bootstrap = async () => {
    const app = express()
    app.use(express.json())
    app.use(cors())
    app.use('/auth', authRouter)
    await databaseCOnnection()
    app.use('{*dummy}', (req, res) => res.status(404).json('invalid route'))
    app.use(globalErrorHandler)
    app.listen(env.port, () => {
        console.log('server is running on port 3000');
    })
}