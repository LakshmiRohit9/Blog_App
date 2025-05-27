const express=require("express")
const Authctrl = require('../../controllers/Author/Authorcontroller.js')
const { isAuthenticated } = require("../../middlewares/auth.js")
const Authorroute=express.Router()

// register page
Authorroute.get('/register',Authctrl.registerpagectrl)
//register
Authorroute.post('/register',Authctrl.registerctrl)
// login page
Authorroute.get('/login',Authctrl.loginpagectrl)
// login
Authorroute.post('/login',Authctrl.loginctrl)
// logout
Authorroute.get('/logout',Authctrl.logoutctrl)
// details

module.exports=Authorroute