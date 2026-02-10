import { ConflictException, NotFoundException, ProviderEnums } from "../../common/index.js";
import { userModel } from "../../database/index.js"
import { findOne } from '../../database/database.service.js'


export const signup = async (data) => {
    let { userName, email, password } = data
    let exsistUser = await findOne({ model: userModel, filter: { email } })
    if (exsistUser) {
            return ConflictException({ message: "User Already Exists" })
    }
    let addedUser = await userModel.insertOne({ userName, email, password })
    return addedUser

}


export const login = async (data) => {
    let { email, password } = data
    //await userModel.findOne({ email, password, provider: ProviderEnums.System }).select("-password -_id")
    let exsistUser = findOne({ model: userModel, filter: { email, password, provider: ProviderEnums.System }, select: "-password -_id" })
    if (exsistUser) {
        return exsistUser
    }
    return NotFoundException({ message: "User Not Found" })
}
