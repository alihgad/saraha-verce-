import { Router } from 'express';
import { getUserById, login, signup } from './auth.service.js';
import { SuccessResponse } from '../../common/index.js';
import { auth } from '../../common/middleware/auth.js';
const router = Router();


router.post('/signup', async (req, res) => {
    let addedUser = await signup(req.body)
    return SuccessResponse({ res, message: "user added ", status: 201, data: addedUser })
})

router.post('/login', async (req, res) => {
    let loginUser = await login(req.body, `${req.protocol}://${req.host}`)
    console.log(`${req.protocol}://${req.host}`);

    return SuccessResponse({ res, message: "user login succesfully", status: 200, data: loginUser })
})
export default router


router.get("/get-user-by-id", auth, async (req, res) => {
    console.log(req.userId , "from service");

    let userData = await getUserById(req.userId)
    res.json(userData)
})