import { Router } from 'express';
import { deleteMessage, getAllMessages, getMessageById, sendMessage } from './messages.service.js'
import { SuccessResponse } from '../../common/index.js';
import { sendMessageSchema } from './messages.validation.js'
import { validation } from '../../common/utils/validation.js';
import { auth } from '../../common/middleware/auth.js';
import { upload } from '../../common/middleware/multer.js'
const router = Router();

router.post('/send-message/:id', upload().single('image'), validation(sendMessageSchema), async (req, res) => {
    let data = await sendMessage(req.body, req.params.id, req.file)
    SuccessResponse({ res, message: "message sent", status: 200, data })
})

router.get('/get-all-messages', auth, async (req, res) => {
    let messages = await getAllMessages(req.userId)
    SuccessResponse({ res, message: "messages retrieved", status: 200, data: messages })
})

router.get('/get-message-by-id/:id', auth, async (req, res) => {
    console.log(req.userId, "from controller ");

    let message = await getMessageById(req.params.id, req.userId)
    SuccessResponse({ res, message: "message retrieved", status: 200, data: message })
})

router.delete('/delete-message/:id', auth, async (req, res) => {
    let deletedMessage = await deleteMessage(req.params.id, req.userId)
    SuccessResponse({ res, message: "message deleted", status: 200, data: deletedMessage })
})
export default router

