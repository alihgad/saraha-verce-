import { Router } from 'express'
import { auth } from '../../common/middleware/auth.js'
import { deleteProfile, getUserData, getUserProfile, removeProfilImage, shareProfileLink, updateProfile } from './user.service.js'
import { SuccessResponse } from '../../common/index.js'
import { extintions, multer_cloud, upload } from '../../common/middleware/multer.js'
import cloudinary from '../../common/utils/cloudinary.js'

const router = Router()

router.get('/get-user-profile', auth, async (req, res) => {
    let data = await getUserProfile(req.userId)
    SuccessResponse({ res, message: "user profile retrieved", status: 200, data })
})


router.post("/test" , multer_cloud(extintions.image).single("image") ,async (req,res)=>{
    await cloudinary.uploader.upload(req.file.path,{
        folder:"users/test"
    })

    res.json({
        msg : "ali"
    })
})


router.get('/get-url-profile', auth, async (req, res) => {
    let data = await shareProfileLink(req.userId)
    SuccessResponse({ res, message: "user profile retrieved", status: 200, data })
})

router.get('/get-user-data', async (req, res) => {
    let data = await getUserData(req.body)
    SuccessResponse({ res, message: "user profile retrieved", status: 200, data })
})

router.put('/update-user', upload().single('image'), auth, async (req, res) => {
    let data = await updateProfile(req.userId, req.body, req.file)
    SuccessResponse({ res, message: "updated", status: 200, data })
})

router.delete('/delete-profile', auth, async (req, res) => {
    let data = await deleteProfile(req.userId)
    SuccessResponse({ res, message: "user deleted", status: 200, data })
})


router.delete('/remove-profile-image', auth ,async (req, res) => {
    let data = await removeProfilImage(req)
    return SuccessResponse({ res, message: "image removed", data})
})

export default router
