import { BadRequestException } from "./reseponce/error.responce.js"





export const validation = (schema) => { // signupschema
    return (req, res, next) => {
        let { value, error } = schema.validate(req.body, { abortEarly: false })
        if (error) {
            throw BadRequestException({ message: "validation error", extra: error })
        }
        next()
    }
}