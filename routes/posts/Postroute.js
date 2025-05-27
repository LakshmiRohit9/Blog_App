const express=require("express")
const Postctrl = require('../../controllers/posts/Postcontroller')
const { isAuthenticated } = require("../../middlewares/auth.js")
const upload = require("../../config/multer")

const postroute=express.Router()

// post form
postroute.get('/form',Postctrl.postformctrl)
// create post
postroute.post('/form',isAuthenticated,upload.array('images',5),Postctrl.createctrl)
// see post
postroute.get('',Postctrl.listctrl)
// see post details
postroute.get('/:id',Postctrl.detailctrl)
// post edit form
postroute.get('/update/:id',Postctrl.getpostformctrl)
// update post
postroute.put('/update/:id',isAuthenticated,upload.array('images',5),Postctrl.updatectrl)
// delete post
postroute.delete('/delete/:id',Postctrl.deletectrl)

module.exports=postroute