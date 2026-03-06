import joi from "joi"


export const signupSchema = joi.object({
    userName: joi.string().min(3).max(50).required(),
    email: joi.string().email().required(),
    password: joi.string().pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/).required(),
    gender: joi.string().optional(),
    shareProfileName: joi.string().required()
})

export const loginShema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().min(3).max(30).required(),
})
