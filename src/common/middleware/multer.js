import multer from 'multer'


export const extintions = {
    image : ["image/jpeg" , "image/png" , "image/jpg" , "image/gif" , "image/webp"],
    vedio : [ "vedio/mp4" , "vedio/mkv" , "vedio/webm" ],
    pdf : ["application/pdf"]
}
export const upload = (file) => {
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'uploads')
        },        filename: function (req, file, cb) {
            cb(null, file.originalname)
        }
    })
    const upload = multer({ storage: storage })
    return upload
}


export const multer_cloud = (allowedExtintions = []) => {
    const storage = multer.diskStorage({      
         filename: function (req, file, cb) {
            cb(null, file.originalname)
        }

    })

    let filefilter = (req,file,cb)=>{
        if(allowedExtintions.includes(file.mimetype)){
            cb(null , true)
        }
        cb(new Error("file not Allowed") , false)
    }
    const upload = multer({ storage: storage , filefilter })
    return upload
}