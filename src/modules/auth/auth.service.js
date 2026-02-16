import { ConflictException, NotFoundException, ProviderEnums, UnauthorizedException } from "../../common/index.js";
import { userModel } from "../../database/index.js"
import { findById, findOne } from '../../database/database.service.js'
import { generateHash, compareHash } from "../../common/index.js";
import { env } from "../../../config/index.js"
import jwt from 'jsonwebtoken'

export const signup = async (data) => {
    let { userName, email, password } = data
    let exsistUser = await findOne({ model: userModel, filter: { email } })
    if (exsistUser) {
        return ConflictException({ message: "User Already Exists" })
    }
    let hashedPassword = await generateHash(password)
    let addedUser = await userModel.insertOne({ userName, email, password: hashedPassword })
    return addedUser
}

export const login = async (data, issuer) => {
    let { email, password } = data
    let exsistUser = await findOne({ model: userModel, filter: { email, provider: ProviderEnums.System } })

    if (exsistUser) {
        let signature = undefined
        let audience = undefined
        switch (exsistUser.role) {
            case "0":
                signature = env.adminSignature
                audience = "Admin"
                break;

            default:
                signature = env.userSignature
                audience = "User"
                break;
        }
        console.log(signature);
        const isMatched = await compareHash(password, exsistUser.password)
        if (isMatched) {
            let token = jwt.sign({ id: exsistUser._id }, signature, {
                audience
            })
            return { exsistUser, token }
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