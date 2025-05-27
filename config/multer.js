const multer=require("multer")
const {CloudinaryStorage} = require("multer-storage-cloudinary")
const cloudinary = require("./cloudinary")

// Configure Cloudinary storage
const storage = new CloudinaryStorage({
    cloudinary,
    params:{
        folder :'blog_proj',
        allowedFormats:['jpg','png'],
        
    }
})

//Configure multer
const upload = multer({
    storage,
})

module.exports=upload
