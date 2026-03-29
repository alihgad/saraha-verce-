import { Router } from 'express';
import { generateAccessToken, getUserById, login, signup, signupMail, logout, verifyEmail, forgetPassword, resetPassword, toggle2sv, verify2sv, verifyLogin } from './auth.service.js';
import { BadRequestException, SuccessResponse } from '../../common/index.js';
import { auth } from '../../common/middleware/auth.js';
import { loginShema, signupSchema } from './auth.validation.js'
import { validation } from '../../common/utils/validation.js'
import { extintions, multer_cloud, upload } from '../../common/middleware/multer.js'
const router = Router();



router.post('/signup', multer_cloud(extintions.image).single('image'), validation(signupSchema), async (req, res) => {
    let addedUser = await signup(req.body, req.file)
    return SuccessResponse({ res, message: "user added ", status: 201, data: addedUser })
})


router.post("/toggle-2sv" ,auth , async (req,res)=>{
        let data = await toggle2sv(req.userId)

        return SuccessResponse({
            res , message : data.msg , status :200
        })

} )

router.post("/verify-2sv" ,auth , async (req,res)=>{
        let data = await verify2sv(req.userId , req.body.otp)

        return SuccessResponse({
            res , message : data.msg , status :200 , data : data.user
        })
        
} )

router.post("/verify-login" , async (req,res)=>{
    let data = await verifyLogin(req.body.email , req.body.otp)

    SuccessResponse({
        res , message :"login" , status :200 , data 
    })
})


router.post("/verify", async (req, res) => {
    let data = await verifyEmail(req.body)
    if (data) {
        return SuccessResponse({
            res,
            message: "3ash",
            data
        })
    } else {
        return BadRequestException({
            message: "wrong"
        })
    }
})

router.post('/login', validation(loginShema), async (req, res) => {
    let loginUser = await login(req.body, `${req.protocol}://${req.host}`)
    console.log(loginUser , "cont");
    
    console.log(`${req.protocol}://${req.host}`);
    return SuccessResponse({ res, message: "user login succesfully", status: 200, data: loginUser })
})


router.get("/get-user-by-id", auth, async (req, res) => {
    console.log(req.userId, "from service");
    let userData = await getUserById(req.userId)
    res.json(userData)
})

router.get('/get-access-token', async (req, res) => {
    let accessToken = await generateAccessToken(req.headers.authorization) /// refresh token
    return SuccessResponse({ res, message: "access token created", status: 200, data: accessToken })
})


router.post('/signup/gmail', async (req, res) => {
    console.log(req.body);
    const data = await signupMail(req.body)
    return SuccessResponse({ res, message: "user signup succesfully", status: 200 })

})


router.post("/logout", auth, async (req, res) => {
    await logout(req)
    return SuccessResponse({
        res,
        message: "logout done"
    })
})

router.post('/forget-password', async (req, res) => {
    let data = await forgetPassword(req.body)
    return SuccessResponse({ res, message: "OTP sent", status: 200 })
})

router.put('/reset-password', async (req, res) => {
    let data = await resetPassword(req.body)
    SuccessResponse({ res, message: "password reset", status: 200, data })
})
export default router
