const express=require("express")
const Commentctrl = require('../../controllers/comments/Commentcontroller')
const commentroute=express.Router()

// create comments
commentroute.post('/posts/:id/comments',Commentctrl.isAuthenticated,Commentctrl.createctrl)
// see comments details
commentroute.get('/:id',Commentctrl.detailsctrl)
// get comment form
commentroute.get('/comments/update/:id',Commentctrl.editcommentctrl)
// update comments
commentroute.put('/comments/update/:id/',Commentctrl.isAuthenticated,Commentctrl.updatectrl)
// delete comments
commentroute.delete('/comments/delete/:id',Commentctrl.isAuthenticated,Commentctrl.deletectrl)

module.exports=commentroute