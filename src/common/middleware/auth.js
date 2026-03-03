
import { env } from '../../../config/index.js'
import jwt from 'jsonwebtoken'
import { decodeToken } from '../security/security.js'
import { UnauthorizedException } from '../utils/reseponce/error.responce.js'

export const auth = (req, res, next) => {
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
            req.userId = data.id
            next()
        default:
            break;
    }

}
