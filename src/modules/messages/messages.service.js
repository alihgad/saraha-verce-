import mongoose from "mongoose"
import { BadRequestException } from "../../common/index.js"
import { findAll, findById, findOne, findOneAndDelete, insertOne, userModel } from "../../database/index.js"
import { messageModel } from "../../database/models/messages.model.js"



export const sendMessage = async (body, userId) => {
    let { message, image } = body
    let exsistUser = await findById({ model: userModel, id: userId })
    if (!exsistUser) {
        throw BadRequestException("invalid user")
    }
    let addedMessage = await insertOne({ model: messageModel, data: { message, image, receverId: userId } })
    if (addedMessage) {
        return addedMessage
    } else {
        throw BadRequestException("message not sent")
    }
}

export const getAllMessages = async (userId) => {
    let exsistUser = await findById({ model: userModel, id: userId })
    if (!exsistUser) {
        throw BadRequestException("invalid user")
    }
    let messages = await findAll({ model: messageModel, filter: { receverId: userId } })
    if (!messages.length) {
        throw BadRequestException({ message: "no messages found for this user" })
    } else {
        return messages
    }
}


export const getMessageById = async (messageId, userId) => {
    let message = await messageModel.findOne({ receverId: userId, _id: messageId })
    // let message = await findOne({ model: messageModel, filter: { _id: messageId, receverId: new mongoose.Types.ObjectId(userId) } })
    console.log(message);

    if (!message) {
        throw BadRequestException({ message: "message not found" })
    } else {
        return message
    }
}
export const deleteMessage = async (messageId, userId) => {
    let deletedMessage = await findOneAndDelete({
        model: messageModel, filter: { _id: messageId, receverId: userId }
    })
    if (!deletedMessage) {
        throw BadRequestException({ message: "message not found" })
    } else {
        return deletedMessage
    }
}