const express=require("express")
const Userctrl = require('../../controllers/users/Usercontroller.js')
const { isAuthenticated } = require("../../middlewares/auth.js")
const userroute=express.Router()
const upload = require("../../config/multer")


// home page

userroute.get('/',isAuthenticated, Userctrl.homectrl);
// profile
userroute.get('/profile',isAuthenticated, Userctrl.profilectrl);
// update profile form
userroute.get('/update',isAuthenticated, Userctrl.updatepeofileformctrl);
//update profile
userroute.post('/update',isAuthenticated,upload.single('pfp'),Userctrl.updateprofilectrl);
// delete profile
userroute.delete('/delete',isAuthenticated,Userctrl.deleteprofilectrl)

// userroute.get('/:id',Userctrl.detailctrl)
// //user update
// userroute.put('/update/:id',Userctrl.updatectrl)

// // pfp upload
// userroute.put('/profile-photo-upload/:id',Userctrl.pfpctrl)
// // cover image upload
// userroute.put('/cover-photo-upload/:id',Userctrl.coverctrl)
// // update password
// userroute.put('/update-password/:id',Userctrl.pwdupdatectrl)
// // logout **
// userroute.get('/logout',async (req,res)=>{
//     try {
//         res.json({msg:"user logged out"})
//     } catch (error) {
//         res.json(error)
//     }
// })

module.exports=userroute
