import { BadRequestException } from '../../common/index.js'
import { findOne, findOneAndDelete, findOneAndUpdate, userModel } from '../../database/index.js'
import { env } from '../../../config/index.js'
import { get, redis_delete, set } from '../../database/redis.service.js'

let genKey = (userId) => {
    return `userProfile::${userId}`
}

export const getUserProfile = async (userId) => {
    let userData = await get(genKey(userId))
    if (userData) {
        return userData
    }
    userData = await findOne({ model: userModel, filter: { _id: userId }, select: 'firstName lastName email shareProfileName image' })
    if (!userData) {
        throw BadRequestException({ message: "user not found" })
    } else {
        await set({
            key: genKey(userId),
            value: userData,
            ttl: 60
        })
        return userData
    }
}

export const shareProfileLink = async (userId) => {
    let userData = await findOne({ model: userModel, filter: { _id: userId }, select: 'firstName lastName email shareProfileName' })
    if (!userData) {
        throw BadRequestException({ message: "user not found" })
    } else {
        let url = `${env.BASE_URL}/${userData.shareProfileName}`
        return url
    }
}

export const getUserData = async (data) => {
    console.log(data);
    let { shareProfileName } = data
    let userLink = shareProfileName.split('/')[3]
    let userData = await findOne({ model: userModel, filter: { shareProfileName: userLink }, select: 'firstName lastName email ' })
    if (userData) {
        return userData
    }
    throw BadRequestException("user not found")

}


export const updateProfile = async (userId, data, file) => {
    let { firstName, lastName, gender, phone } = data
    let updatedData = {}
    firstName ? updatedData.firstName = firstName : null
    lastName ? updatedData.lastName = lastName : null
    gender ? updatedData.gender = gender : null
    phone ? updatedData.phone = phone : null
    if (file) {
        updatedData.image = `${env.BASE_URL}/uploads/${file.filename}`
    }
    let exsistUser = await findOneAndUpdate({ model: userModel, filter: { _id: userId }, update: updatedData, options: { new: true } })
    if (exsistUser) {
        await redis_delete(genKey(userId))
        return exsistUser
    }
    throw BadRequestException("user not found")
}


export const deleteProfile = async (userId) => {

    let userData = await findOneAndDelete({ model: userModel, filter: { _id: userId } })
    if (userData) {
        return userData
    } else {
        throw BadRequestException("user not found")
    }
}
