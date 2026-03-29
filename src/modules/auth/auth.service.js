import { BadRequestException, ConflictException, decodeRefreshToken, genetareToken, NotFoundException, ProviderEnums, UnauthorizedException } from "../../common/index.js";
import { userModel } from "../../database/index.js"
import { findById, findOne, findOneAndUpdate, insertOne } from '../../database/database.service.js'
import { generateHash, compareHash } from "../../common/index.js";
import { env } from "../../../config/index.js"
import jwt from 'jsonwebtoken'
import { OAuth2Client } from 'google-auth-library'
import { createRevokeKey, get, increment, redis_delete, set, ttl } from "../../database/redis.service.js";
import { sendEmail } from "../../common/utils/email/sendEmail.js";
import cloudinary from "../../common/utils/cloudinary.js";


export const signup = async (data, file) => {
    let { userName, email, password, shareProfileName } = data
    let exsistUser = await findOne({ model: userModel, filter: { email } })
    if (exsistUser) {
        return ConflictException({ message: "User Already Exists" })
    }





    let hashedPassword = await generateHash(password)
    let addedUser = await userModel.insertOne({ userName, email, password: hashedPassword, shareProfileName })


    if (file) {
        let { public_id, secure_url } = await cloudinary.uploader.upload(file.path, {
            folder: `users/${addedUser._id}/profileImage`,
            resource_type: "image"
        })

        addedUser.profileImage = {
            public_id,
            secure_url
        }

        await addedUser.save()
    }




    let code = Math.floor(Math.random() * 10000)
    code = code.toString().padEnd(4, 0)

    set({
        key: `otp::${addedUser._id}`,
        value: await generateHash(code),
        ttl: 60 * 5
    })

    sendEmail({
        to: email,
        subject: "verfiy your email bsor3a",
        html: `<h1>Hello</h1> `
    })

    return addedUser
}



export const verifyEmail = async ({ code, email }) => {
    let user = await findOne({
        model: userModel,
        filter: { email },
    })
    if (user.isVerfied) {
        return {
            message: "tany ?"

        }
    }



    if (!user) {
        // return NotFoundException()
        throw new Error("not found")
    }

    let redisCode = await get(`otp::${user._id}`)



    if (await compareHash(code, redisCode)) {
        user = await findOneAndUpdate({
            model: userModel,
            filter: { _id: user._id },
            update: { isVerfied: true },
            options: { new: true }
        })
    } else {
        BadRequestException()
    }

    return user

}

export const login = async (data, issuer) => {
    let { email, password } = data
    let counterKey = `user::${email}`
    let bannKey = `user::banned::${email}`

    if (await get(bannKey)) {
        throw new Error(`you are banned try again after ${Math.ceil(await ttl(bannKey) / 60)} minutes`)
    }


    let exsistUser = await findOne({ model: userModel, filter: { email } })

    if(!exsistUser.isVerfied){
        return BadRequestException({
            message : " verfiy your email first w t3ala tany "
        })
    }

    if (exsistUser) {

        const isMatched = await compareHash(password, exsistUser.password)

        if (isMatched) {
            if(await get(counterKey)){
                await redis_delete(counterKey)
            }

            if (exsistUser.tsv) {
                let otp = Math.ceil(Math.random() * 1000).toString().padEnd(4, "1")

                set({
                    key: `login::otp::${exsistUser.email}`,
                    value: otp,
                    ttl: 5 * 60
                })

                await sendEmail({
                    to: exsistUser.email,
                    subject: "tsv to login",
                    html: `<p> Your OTP : ${otp} </p> <br/> <p>OTP is valid for 5 minutes</p>`
                })


                return { msg: "done" }
            } else {
                let { accessToken, refreshToken } = genetareToken(exsistUser)
                return { exsistUser, accessToken, refreshToken }
            }
        } else {
            console.log("wrong password");

            if (await get(counterKey)) {
                await increment(counterKey)
                if (await get(counterKey) == 5) {
                    await set({
                        key: bannKey,
                        value: "true",
                        ttl: 5 * 60
                    })

                    await redis_delete(counterKey)
                }
            } else {
                await set({
                    key: counterKey,
                    value: 1
                })
            }

            throw new Error("wrong password")
        }

    }
    return NotFoundException({ message: "User Not Found" })
}


export const toggle2sv = async (userId) => {
    let user = await findById({
        model: userModel,
        id: userId
    })

    if (!user) {
        NotFoundException({
            message: "user not found"
        })
    }

    let otp = Math.ceil(Math.random() * 1000).toString().padEnd(4, "1")

    set({
        key: `2sv::otp::${userId}`,
        value: otp,
        ttl: 5 * 60
    })

    await sendEmail({
        to: user.email,
        subject: user.tsv ? "Disable 2sv" : "Enable 2sv",
        html: `<p> Your OTP : ${otp} </p> <br/> <p>OTP is valid for 5 minutes</p>`
    })


    return { msg: "done" }

}

export const verify2sv = async (userId, otp) => {

    let user = await findById({
        model: userModel,
        id: userId
    })

    if (!user) {
        NotFoundException({
            message: "user not found"
        })
    }




    if (otp != await get(`2sv::otp::${userId}`)) {
        BadRequestException({
            message: "wrong otp"
        })
    } else {
        user = await findOneAndUpdate({
            model: userModel,
            filter: { _id: userId },
            update: { tsv: !user.tsv },
            options: { new: true }
        })
        redis_delete(`2sv::otp::${userId}`)


    }



    return { msg: "done", user }
}

export const verifyLogin = async (email, otp) => {
    let storedOTP = await get(`login::otp::${email}`)

    

    let exsistUser = await findOne({
        model : userModel,
        filter : {email}
    })

    console.log(exsistUser );
    

    if(!exsistUser){
        return NotFoundException({
            message : "not found user"
        })
    }

    if (otp != storedOTP) {
        return BadRequestException({
            message: "wrong otp"
        })
    } else {
        redis_delete(`login::otp::${email}`)
        let { accessToken, refreshToken } = genetareToken(exsistUser)
        return { exsistUser, accessToken, refreshToken }
    }
}



export const getUserById = async (userId) => {
    console.log(userId, "from user id");
    let userData = await findById({ model: userModel, id: userId })
    console.log(userData);
    return userData
}

export const generateAccessToken = (refreshToken) => {

    let decoded = decodeRefreshToken(refreshToken)
    let signature = undefined
    let audience = undefined
    switch (decoded.aud) {
        case "Admin":
            signature = env.adminSignature
            audience = "Admin"
            break;

        default:
            signature = env.userSignature
            audience = "User"
            break;
    }
    let accessToken = jwt.sign({ id: decoded.id }, signature, {
        audience,
        expiresIn: "30m"
    })
    return accessToken
}
export const signupMail = async (token) => {
    const client = new OAuth2Client();
    const ticket = await client.verifyIdToken({
        idToken: token.idToken,
        audience: "12909487230-8po2bsrb5hg1p4ucar23jjsc8qie6ob9.apps.googleusercontent.com"
    });
    const payload = ticket.getPayload();
    console.log(payload);
    if (!payload.email_verified) {
        throw BadRequestException("email not verified")
    }
    let exsistUser = await findOne({ model: userModel, filter: { email: payload.email } })
    if (exsistUser) {
        throw ConflictException("user already exsist")
    } else {
        let addedUser = await insertOne({
            model: userModel, data: {
                userName: payload.name,
                email: payload.email,
                provider: ProviderEnums.Google
            }
        })
        if (addedUser) {
            return addedUser
        } else {
            throw BadRequestException("something went wrong")
        }
    }
}

export const logout = async (req) => {
    let redisKey = createRevokeKey(req)

    await set({
        key: redisKey,
        value: 1,
        ttl: req.decoded.iat + 30 * 60
    })
}

export const forgetPassword = async (data) => {
    let { email } = data
    let exsistedUser = await findOne({ model: userModel, filter: { email } })
    if (!exsistedUser) {
        throw BadRequestException("user not found")
    } else {

        let code = Math.ceil(Math.random() * 10000)
        code = code.toString().padEnd(4, 0)

        await set({
            key: `otp::${exsistedUser._id}`,
            value: await generateHash(code),
            ttl: 60 * 5
        })

        await sendEmail({
            to: exsistedUser.email,
            subject: "rest password",
            html: `<h1>reset password</h1> 
                <p>${code} </p>
            `
        })
        return "otp sent"
    }
}


export const resetPassword = async (data) => {
    let { email, otp, password } = data
    let exsistedUser = await findOne({ model: userModel, filter: { email } })
    if (!exsistedUser) {
        throw BadRequestException("user not found")
    }
    let hashOtp = await get(`otp::${exsistedUser._id}`)
    console.log(hashOtp, 'from hashed otp');
    if (await compareHash(otp, hashOtp)) {
        console.log('hello from the if condtion');
        console.log(password, "test");
        console.log(exsistedUser.password);
        if (await compareHash(password, exsistedUser.password)) {
            throw BadRequestException("new password can not be same as old password")
        } else {
            console.log(password);
            let hashedPassword = await generateHash(password)
            console.log(hashedPassword);
            let updatedUser = await findOneAndUpdate({
                model: userModel,
                filter: { _id: exsistedUser._id },
                update: { password: hashedPassword },
                options: { new: true }
            })
            if (updatedUser) {
                await redis_delete(`otp::${exsistedUser._id}`)
                return updatedUser
            } else {
                throw BadRequestException("something went wrong")
            }
        }
    } else {
        return BadRequestException("invalid otp")
    }

}