const Post = require("../../models/post/Post")
const Comment = require("../../models/comment/Comment")
const File = require("../../models/files/File")
const User = require("../../models/user/User")
const jwt = require("jsonwebtoken")
const cloudinary = require("../../config/cloudinary");


// const { loggedinuser } = require("../../middlewares/auth.js")
// const AsyncHandler=require("express-async-handler")

const getUserData = (req) => {
    const token = req.cookies ? req.cookies.token : null;
    if (!token) {
        return null;
    }
    return new Promise((resolve, reject) => {
        jwt.verify(token, "anykey", (err, decoded) => {
            if (err) {
                reject(null); // Return null if token verification fails
            } else {
                req.userData = decoded; // Add the user into the req object
                resolve(decoded); // Resolve with the decoded user data
            }
        });
    });
};




// get user

// autentication
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

// post form
const postformctrl = async (req, res) => {
    const userData = await getUserData(req)
    console.log(userData)
    try {
        res.render('postform.ejs', {
            title: 'Create Post',
            username: userData.username,
            success: "",
            error: ''
        })
    } catch (error) {
        res.send(error.message)
    }
}

// create
const createctrl = async (req, res) => {
    try {
        const { title, description } = req.body
        if (!req.files || req.files.length === 0 || !title || !description) {
            res.render('postform', {
                title: 'Create Post',
                username: req.userData.username,
                success: "",
                error: 'Fill all details'
            })
        }
        else {
            const images = await Promise.all(
                req.files.map(async (file) => {
                    const newfile = await File.create({
                        url: file.path,
                        public_id: file.filename,
                        user: req.userData.id,
                    })
                    return {
                        url: newfile.url,
                        public_id: newfile.public_id,
                    }
                }))
            const post = await Post.create({
                title,
                description,
                user: req.userData.id,
                image: images,

            })
            const user = await User.findById(req.userData.id)
            user.post.push(post._id)
            await user.save()
            res.render('postform', {
                title: 'Create Post',
                username: req.userData.username,
                success: "post created successfully",
                error: ''
            })
        }

    } catch (error) {
        res.json(error)
    }
}

// post list
const listctrl = async (req, res) => {
    try {
        const userData = await getUserData(req)
        if (!userData) {
            console.log("hello")
            username = null
        }
        else{
            username = userData.username
        }
        const posts = await Post.find().populate('user', 'username')
        res.render('posts', {
            title: 'Posts',
            username: username || '',
            posts,
            error: ''
        })
    } catch (error) {
        res.json(error)
    }
}

// post details
const detailctrl = async (req, res) => {
    try {
        const userData = await getUserData(req)
        const post = await Post.findById(req.params.id)
            .populate('user', 'username')
            .populate({
                path: 'comment',
                populate: {
                    path: 'user',
                    model: 'User',
                    select: 'username'
                }
            })
        if (userData) {
            res.render('postdetails.ejs', {
                title: 'Post',
                username: userData.username,
                userData,
                post,
                error: ''
            })
        }
        else {
            res.render('postdetails.ejs', {
                title: 'Post',
                username: null,
                post,
                error: ''
            })
        }

        // res.json({msg:"hello"})
    } catch (error) {
        res.json(error)
    }
}

// edit post form
const getpostformctrl = async (req, res) => {
    try {
        const userData = await getUserData(req)
        const post = await Post.findById(req.params.id)
        res.render('editpost', {
            title: "Edit post",
            post,
            username: userData,
            error: ""
        })
        // res.json({msg:'hello'})
    } catch (error) {
        console.log(error)
    }
}

// update post
const updatectrl = async (req, res) => {
    try {
        const { title, description } = req.body
        const post = await Post.findById(req.params.id)
        post.title = title || post.title;
        post.description = description || post.description;
        const userData = await getUserData(req)
        if (req.files) {
            await Promise.all(
                post.image.map(async (image) => {
                    await cloudinary.uploader.destroy(image.public_id);
                })
            );
        }
        post.image = await Promise.all(
            req.files.map(async (file) => {
                const newFile = new File({
                    url: file.path,
                    public_id: file.filename,
                    user: req.userData.id,
                });
                await newFile.save();
                return {
                    url: newFile.url,
                    public_id: newFile.public_id,
                };
            })
        );
        await post.save()
        res.redirect(`/posts/${post._id}`)
    } catch (error) {
        console.log(error)
    }
}

// delete post
const deletectrl = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        console.log(post._id)
        for (const img of post.image) {
            await cloudinary.uploader.destroy(img.public_id);
        }
        // Delete all associated comments
        await Promise.all(post.comment.map(async (commentId) => {
            const comment = await Comment.findById(commentId);
            if (comment) {
                await User.findByIdAndUpdate(comment.user, {
                    $pull: { comment: comment._id }
                });
                await Comment.findByIdAndDelete(comment._id);
            }
        }));
        // Remove post reference from user
        await User.findByIdAndUpdate(post.user, {
            $pull: { post: post._id }
        });
      
        await Post.findByIdAndDelete(post._id);
        // await Post.findByIdAndDelete(req.params.id);
        res.redirect("/posts")
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    isAuthenticated, postformctrl, createctrl, listctrl, detailctrl, getpostformctrl, updatectrl, deletectrl
}