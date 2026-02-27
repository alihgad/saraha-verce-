import joi from "joi"


export const signupSchema = joi.object({
    userName: joi.string().min(3).max(50).required(),
    age: joi.number().min(18).max(50).required().messages({
        "number.min": "age must be at least 18",
        "number.max": "age must be at most 50"
    }),
    email: joi.string().email().required(),
    password: joi.string().pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/).required(),
    gender: joi.string().optional(),
    users: joi.array().items(joi.object({
    })).min(1).max(5).required()
})

export const loginShema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().min(3).max(30).alphanum().required(),
})
