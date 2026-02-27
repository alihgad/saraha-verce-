import mongoose, { Types } from "mongoose";


const messageSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true,
        min: 10,
        max: 500
    },
    receverId: {
        type: Types.ObjectId,
        ref: "User",
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    image: {
        type: String,
    }
},
    { timestamps: true }
)

export const messageModel = mongoose.model("Message", messageSchema)
