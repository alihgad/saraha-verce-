import { BadRequestException, ConflictException, decodeRefreshToken, genetareToken, NotFoundException, ProviderEnums, UnauthorizedException } from "../../common/index.js";
import { userModel } from "../../database/index.js"
import { findById, findOne, insertOne } from '../../database/database.service.js'
import { generateHash, compareHash } from "../../common/index.js";
import { env } from "../../../config/index.js"
import jwt from 'jsonwebtoken'
import { OAuth2Client } from 'google-auth-library'


export const signup = async (data, file) => {
    let { userName, email, password, shareProfileName } = data
    let exsistUser = await findOne({ model: userModel, filter: { email } })
    if (exsistUser) {
        return ConflictException({ message: "User Already Exists" })
    }
    let image = ''
    if (file) {
        image = `${env.BASE_URL}/uploads/${file.filename}`
    }
    console.log();
    
    let hashedPassword = await generateHash(password)
    let addedUser = await userModel.insertOne({ userName, email, password: hashedPassword, shareProfileName, image })
    return addedUser
}

export const login = async (data, issuer) => {
    let { email, password } = data
    let exsistUser = await findOne({ model: userModel, filter: { email, provider: ProviderEnums.System } })
    if (exsistUser) {
        const isMatched = await compareHash(password, exsistUser.password)
        if (isMatched) {
            let { accessToken, refreshToken } = genetareToken(exsistUser)
            return { exsistUser, accessToken, refreshToken }
        }
    }
    return NotFoundException({ message: "User Not Found" })
}


export const getUserById = async (userId) => {
    console.log(userId, "from user id");
    let userData = await findById({ model: userModel, id: userId })
    console.log(userData);
    return userData
}

export const generateAccessToken = (refreshToken) => {

    let decoded = decodeRefreshToken(refreshToken)
    let signature = undefined
    let audience = undefined
    switch (decoded.aud) {
        case "Admin":
            signature = env.adminSignature
            audience = "Admin"
            break;

        default:
            signature = env.userSignature
            audience = "User"
            break;
    }
    let accessToken = jwt.sign({ id: decoded.id }, signature, {
        audience,
        expiresIn: "30m"
    })
    return accessToken
}
export const signupMail = async (token) => {
    const client = new OAuth2Client();
    const ticket = await client.verifyIdToken({
        idToken: token.idToken,
        audience: "12909487230-8po2bsrb5hg1p4ucar23jjsc8qie6ob9.apps.googleusercontent.com"
    });
    const payload = ticket.getPayload();
    console.log(payload);
    if (!payload.email_verified) {
        throw BadRequestException("email not verified")
    }
    let exsistUser = await findOne({ model: userModel, filter: { email: payload.email } })
    if (exsistUser) {
        throw ConflictException("user already exsist")
    } else {
        let addedUser = await insertOne({
            model: userModel, data: {
                userName: payload.name,
                email: payload.email,
                provider: ProviderEnums.Google
            }
        })
        if (addedUser) {
            return addedUser
        } else {
            throw BadRequestException("something went wrong")
        }
    }
}