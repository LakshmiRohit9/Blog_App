const User = require("../../models/user/User")
const Post = require("../../models/post/Post")
const File = require("../../models/files/File")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken");
const cloudinary = require("../../config/cloudinary");
const Comment = require("../../models/comment/Comment");
let loggedinuser=''

// Authenticate
const isAuthenticated = (req, res, next) => {
    //Access the token from req.cookies
    console.log("isAuthenticated")
    const token = req.cookies ? req.cookies.token : null;
    console.log(token)
    //redirect
    if (!token) {
      return res.redirect("/api/v1/users/login");
    }
    //Verify the token
    jwt.verify(token, "anykey", (err, decoded) => {
      if (err) return res.redirect("/login");
      //Add the user into the req obj
      req.userData = decoded;
      next();
    });
};

// home page
const homectrl =async (req,res)=>{
    try {
        const username = req.userData ? req.userData.username : null;
        res.render('home',{username,title:'home'})
    } catch (error) {
        console.log("error")
        res.json(error)
    }
}



// user details
const detailctrl = async (req,res)=>{
    try {
        res.json({msg:"user details"})
    } catch (error) {
        res.json(error)
    }
}

const updatepeofileformctrl = async (req, res) => {
    try {
        const user = await User.findById(req.userData.id).select("-password");
        if (!user) {
            return res.render('login.ejs',{username,title:'login'});
          }
        res.render('editprofile.ejs', {
            title: 'Edit Profile',
            username: user.username,
            user,
        });
    } catch (error) {
        console.log("error in update profile form controller")
        res.json(error)
    }
}

// update controller
const updateprofilectrl =async (req,res)=>{
    try {
        const {username,email,password}=req.body
        const user = await User.findById(req.userData.id)
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        user.username = username || user.username;
        user.email = email || user.email;
        console.log("user email",user.email)
        console.log(req.file)
        if (req.file) {
            if (user.pfp && user.pfp.public_id) {
              await cloudinary.uploader.destroy(user.pfp.public_id);
            }
            console.log("step1")
            
            const newfile = new File({
                url: req.file.path,
                public_id: req.file.filename,
                user: req.userData.id,
            });
            await newfile.save();
            console.log("file",newfile)
            console.log(newfile.url)
            user.pfp = { url: newfile.url, public_id: newfile.public_id };
          }
        console.log("user pfp updated")
        await user.save();
        res.render("editProfile", {
          title: "Edit Profile",
          user,
          error: null,
          success: "Profile updated successfully",
        });
    } catch (error) {
        console.log("error in update profile controller")
        res.json(error)
    }
}

// profile controller
const profilectrl = async (req,res)=>{
    try {
        // const user = await User.findById(req.userData.id)
        const user = await User.findById(req.userData.id).select("-password");
        if (!user) {
            return res.render('login.ejs',{username,title:'login'});
          }
        const posts = await Post.find({ user: req.userData.id }).sort({
          createdAt: -1,
        });
        res.render('profile.ejs', {
            title: 'Profile',
            username: user.username,
            user,
            posts,
            postCount: posts.length,
        });
        // const username = req.userData ? req.userData.username : null;
        // res.render('home',{username,title:'home'})
    } catch (error) {
        console.log("error in profile controller")
        res.json(error)
    }
}

// profile photo
const pfpctrl = async (req,res)=>{
    try {
        res.json({msg:"user pfp"})
    } catch (error) {
        res.json(error)
    }
}

// cover image
const coverctrl = async (req,res)=>{
    try {
        res.json({msg:"user cover"})
    } catch (error) {
        res.json(error)
    }
}

// password update
const pwdupdatectrl = async (req,res)=>{
    try {
        res.json({msg:"user password updated"})
    } catch (error) {
        res.json(error)
    }
}

const deleteprofilectrl = async (req, res) => {
    try {
        const user = await User.findById(req.userData.id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        // Delete user's profile picture if it exists
        if (user.pfp && user.pfp.public_id) {
            await cloudinary.uploader.destroy(user.pfp.public_id);
        }
        // Delete all posts created by the user and their associated images and comments
        const posts = await Post.find({ author: req.userData.id });
        for (const post of posts) {
          for (const img of post.image) {
            await cloudinary.uploader.destroy(img.public_id);
          }
          await Comment.deleteMany({ post: post._id });
          await Post.findByIdAndDelete(post._id);
        }
        //delete the all comments made by the user
        await Comment.deleteMany({ author: req.userData.id });
        //delete all files uploaded by the user
        const files = await File.find({ uploaded_by: req.userData.id });
        for (const file of files) {
          await cloudinary.uploader.destroy(file.public_id);
        }
        //delete user
        await User.findByIdAndDelete(req.userData.id);
        res.clearCookie("token");
        res.redirect("/api/v1/auth/register");
    } catch (error) {
        console.log("error in delete profile controller")
        res.json(error);
    }
}

module.exports={
    isAuthenticated,homectrl,detailctrl,updateprofilectrl,updatepeofileformctrl,profilectrl,pfpctrl,coverctrl,pwdupdatectrl,deleteprofilectrl
}