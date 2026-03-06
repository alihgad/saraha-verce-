import { Router } from 'express';
import { generateAccessToken, getUserById, login, signup, signupMail } from './auth.service.js';
import { BadRequestException, SuccessResponse } from '../../common/index.js';
import { auth } from '../../common/middleware/auth.js';
import { loginShema, signupSchema } from './auth.validation.js'
import { validation } from '../../common/utils/validation.js'
import { upload } from '../../common/middleware/multer.js'
const router = Router();



router.post('/signup', upload().single('image'), validation(signupSchema), async (req, res) => {
    let addedUser = await signup(req.body, req.file)
    return SuccessResponse({ res, message: "user added ", status: 201, data: addedUser })
})

router.post('/login', validation(loginShema), async (req, res) => {
    let loginUser = await login(req.body, `${req.protocol}://${req.host}`)
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
export default router
