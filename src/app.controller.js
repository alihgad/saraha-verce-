import express from "express"
import { env } from '../config/env.service.js'
import { globalErrorHandler } from "./common/index.js"
import { databaseCOnnection } from "./database/index.js"
import authRouter from './modules/auth/auth.controller.js'
import messageRouter from './modules/messages/messages.controller.js'
import cors from 'cors'
import fs from 'fs'
import path from 'path'

export const bootstrap = async () => {
    const app = express()

    // Log all requests
    app.use((req, res, next) => {
        console.log(`${req.method} ${req.url}`)
        next()
    })

    const uploadsPath = path.join(process.cwd(), 'uploads')
    console.log('Serving static files from:', uploadsPath)
    app.use(express.static(uploadsPath))
    app.use(express.static('public'))
    app.use(express.json())
    app.use(express.urlencoded({ extended: false }))

    app.use(cors())
    app.use('/auth', authRouter)
    app.use('/messages', messageRouter)
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