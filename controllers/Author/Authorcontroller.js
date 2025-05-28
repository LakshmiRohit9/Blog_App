const User = require("../../models/user/User")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken");

let loggedinuser=''

// Authenticate
const isAuthenticated = (req, res, next) => {
    //Access the token from req.cookies
    const token = req.cookies ? req.cookies.token : null;
    //redirect
    if (!token) {
      return res.redirect("/users/login");
    }
    //Verify the token
    jwt.verify(token, "anykey", (err, decoded) => {
      if (err) return res.redirect("/login");
      //Add the user into the req obj
      req.userData = decoded;
      next();
    });
};

//register page
const registerpagectrl=async (req,res)=>{
    try {
        const username = req.userData ? req.userData.username : null;
        // res.json({msg:"user register page"})
        res.render('register.ejs',{username,title :'register',error:''})
    } catch (error) {
        res.json(error)
    }
}
// register
const registerctrl = async (req,res)=>{
    try {
        const {username,email,password}=req.body
        const user=await User.findOne({email})
        if (user){
            res.render('register.ejs',{username,title :'register',error:'user exists'})
        }else{
            const hashedpassword = await bcrypt.hash(password,7)
            const user = await User.create({username,email,password:hashedpassword})
            res.redirect('/auth/login')
        }
    } catch (error) {
        res.render("register",{
            title :'register',
            error:error.message
        })
        
    }
}

//login page
const loginpagectrl=async (req,res)=>{
    try {
        const username = req.userData ? req.userData.username : null;
        // res.json({msg:"user login page"})
        res.render('login.ejs',{username,title:'login'})
    } catch (error) {
        res.json(error)
    }
}
//login
const loginctrl=async (req,res,next)=>{
    try {
        const {email,password}=req.body
        const user=await User.findOne({email})
        if (user && (await bcrypt.compare(password,user.password))){
            const token = jwt.sign(
                {
                  username: user.username,
                  email: user.email,
                  id:user._id
                },
                "anykey",
                {
                  expiresIn: "3d",
                }
            );
            //save the token into cookie
            res.cookie("token", token, {
              maxAge: 3 * 24 * 60 * 60 * 1000,
              httpOnly: true,
            });
            res.redirect('/users/home')
        }else{
            res.send('invalid credentials')
        }
    } catch (error) {
        res.send(`${error.message}`)
    }
}

// logout
const logoutctrl = async (req,res)=>{
    try {
        res.clearCookie("token")
        res.redirect('/auth/login')
    } catch (error) {
        res.json(error)
    }
}

module.exports={
    registerctrl,loginpagectrl,registerpagectrl,loginctrl,logoutctrl,isAuthenticated
}