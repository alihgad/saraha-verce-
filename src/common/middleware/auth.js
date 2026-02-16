
import { env } from '../../../config/index.js'
import jwt from 'jsonwebtoken'

export const auth = (req, res, next) => {
    let { authorization } = req.headers
    if (!authorization) {
        UnauthorizedException("un authorized")
    }
    let decoded = jwt.decode(authorization)

    let signature = undefined

    switch (decoded.aud) {
        case "Admin":
            signature = env.adminSignature
            break;

        default:
            signature = env.userSignature
            break;
    }
    console.log(signature);

    let decodedData = jwt.verify(authorization, signature)
    console.log(decodedData);
    req.userId = decodedData.id
    next()
}