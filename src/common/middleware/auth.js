
import { env } from '../../../config/index.js'
import jwt from 'jsonwebtoken'
import { decodeToken } from '../security/security.js'
import { UnauthorizedException } from '../utils/reseponce/error.responce.js'
import { createRevokeKey, get, keys } from '../../database/redis.service.js'

export const auth = async (req, res, next) => {
    let { authorization } = req.headers
    console.log(authorization);

    let [flag, token] = authorization.split(" ")

    switch (flag) {
        case "Basic":
            const Basicdata = Buffer.from(token, "base64").toString()
            let [email, password] = Basicdata.split(":")
            console.log(email, "  ", password);
            break;
        case "Bearer":
            if (!authorization) {
                throw UnauthorizedException("un authorized")
            }
            let data = decodeToken(token)
            console.log(data);

            let revoked = await get(createRevokeKey({
                userId : data.id,
                token
            }))
            

            if(revoked !== null){
                throw new Error("alerdy logout")
            }
            
            req.userId = data.id
            req.token = token
            req.decoded = data
            next()
        default:
            break;
    }

}
