import { hash, compare } from 'bcrypt'
import { env } from '../../../config/env.service.js'

export const generateHash = async (planText) => {
    const hashPassword = await hash(planText, + env.salt)
    return hashPassword
}

export const compareHash = async (planText, hash) => {
    const isMatched = await compare(planText, hash)
    return isMatched
}