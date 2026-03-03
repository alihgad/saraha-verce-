import { Router } from 'express';
import { generateAccessToken, getUserById, login, signup, signupMail } from './auth.service.js';
import { BadRequestException, SuccessResponse } from '../../common/index.js';
import { auth } from '../../common/middleware/auth.js';
import { loginShema, signupSchema } from './auth.validation.js'
import { validation } from '../../common/utils/validation.js'
import { extinstions, multer_local } from '../../common/middleware/multer.js';
const router = Router();



router.post("/single", multer_local({ customPath: "profileImages/users/image" ,allowedType:extinstions.image}).single("image"), (req, res) => {


    req.file.finalPath = `${req.file.destination}/${req.file.filename}`
    res.status(200).json({
        msg: "done",
        file: req.file,
        body: req.body
    })
})

router.post("/array", multer_local({ customPath: "array" , allowedType:[...extinstions.image , ...extinstions.vedio] }).array("images"), (req, res, next) => {

    console.log(req.host);

    console.log(req.protocol);


    let baseUrl = `${req.protocol}://${req.host}/`




    res.status(200).json({
        msg: "done",
        files: req.files.map((file) => {
            file.finalPath = baseUrl + file.destination + "/" + file.filename
            return file
        })
    })
})

router.post("/fields", multer_local({ customPath: "array" }).fields([
    { name: "profile", maxCount: 1 },
    { name: "cover", maxCount: 2 },
    { name: "cv", maxCount: 1 }
]), (req, res, next) => {


    let baseUrl = `${req.protocol}://${req.host}/`

    let fields = ["profile", "cover", "cv"]

    for (let i = 0; i < fields.length; i++) {
        let arr = req.files[fields[i]]

        console.log(arr);
        for (let j = 0; j < arr.length; j++) {
            arr[j].finalPath = baseUrl + arr[j].destination + "/" + arr[j].filename
        }

    }

    res.status(200).json({
        msg: "done",
        files: req.files
    })
})

router.post("/any", multer_local().any(), (req, res, next) => {

    res.status(200).json({
        msg: "done",
        files: req.files
    })
})

router.post("/none", multer_local().none(), (req, res, next) => {

    res.status(200).json({
        msg: "done",
        files: req.files,
        body : req.body
    })
})



router.post('/signup', validation(signupSchema), async (req, res) => {
    // let addedUser = await signup(req.body)
    return SuccessResponse({ res, message: "user added ", status: 201 })
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
