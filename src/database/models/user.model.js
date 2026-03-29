import mongoose from "mongoose";
import { GenderEnums, ProviderEnums, roleEnums } from '../../common/index.js'

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 2,
        maxLength: 20
    }, lastName: {
        type: String,
        required: true,
        minLength: 2,
        maxLength: 20
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String
        // required: true
    },
    shareProfileName: {
        type: String,
        unique: true,
        required: true
    },
    phone: String,
    DOB: Date,
    gender: {
        type: String,
        enum: Object.values(GenderEnums),
        default: GenderEnums.Male
    },
    provider: {
        type: String,
        enum: Object.values(ProviderEnums),
        default: ProviderEnums.System
    },
    image: {
        type: String
    },
    role: {
        type: String,
        enum: Object.values(roleEnums),
        default: roleEnums.User
    },
    isVerfied : {
        type : Boolean,
        default : false
    },
    profileImage:{
        public_id : String,
        secure_url : String
    },
    tsv :{
        type : Boolean ,
        default : false
    }
})

userSchema.virtual('userName').set(function (value) {
    let [firstName, lastName] = value.split(' ')
    this.firstName = firstName
    this.lastName = lastName
}).get(function () {
    return `${this.firstName} ${this.lastName}`
})

export const userModel = mongoose.model("User", userSchema)