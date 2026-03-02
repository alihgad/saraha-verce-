import multer from "multer"
import fs from "node:fs"


export let extinstions = {
    image : ["image/jpeg" , "image/png" , "image/jpg" , "image/webp"],
    vedio : ["video/mp4" , "video/mkv" , "video/webm" , "video/ogg" ],
    pdf : ["application/pdf"],
    excel : ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"],
    word : ["application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
}


export let multer_local = ({customPath , allowedType} = {customPath : "general"})=>{
    
    let storage = multer.diskStorage({
        destination : function(req , file ,cb){
            let filesPath = `upload/${customPath}`
            if(!fs.existsSync(filesPath)){
                fs.mkdirSync(filesPath , {recursive : true})
            }

            cb(null , filesPath)
        },

        filename : function(req,file,cb){
            let prefix = Date.now()
            let fileName = `${prefix}-${file.originalname}` 
            cb(null, fileName)
        }
    })


    let fileFilter = function(req,file,cb){

        console.log(file);
        console.log(allowedType);
        console.log(allowedType.includes(file.mimetype));
        
        
        if(allowedType.includes(file.mimetype)){
            cb(null , true)
        }else{
            cb("wrong type" , false)
        }
        

    }


    return multer({ storage , fileFilter , limits : {
        fileSize : 1000 * 1024 * 1024,
    } })
}
