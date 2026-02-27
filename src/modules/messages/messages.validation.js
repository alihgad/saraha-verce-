import joi from "joi"


export const sendMessageSchema = joi.object({
    message: joi.string().min(10).max(500).required().messages({
        "string.min": "message must be at least 10 characters",
        "string.max": "message must be at most 500 characters"
    }),
    // id: joi.object,
    image: joi.string().optional()
})