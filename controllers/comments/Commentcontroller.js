const  Post = require( "../../models/post/Post")
const Comment = require("../../models/comment/Comment")

const jwt = require("jsonwebtoken");
const User = require("../../models/user/User");

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

// create comment
const createctrl = async (req,res)=>{
    try {
        const {message}=req.body
        const postid=req.params.id
        const post=await Post.findById(postid)
        const userData=await getUserData(req)
        const user=await User.findById(userData.id)
        console.log(userData.id)
        console.log(user)
        console.log(post)
        if(!message){
            res.render('postdetails',{
                title:'Post',
                username:userData.username,
                post,
                error:'Comment cannot be empty'
            })
        }
        const comment= await Comment.create({
            message,
            post:postid,
            user:userData.id 
        })
        console.log(comment)
        post.comment.push(comment._id)
        user.comment.push(comment._id)
        await post.save()
        await user.save()
        res.redirect(`/posts/${postid}`)
    } catch (error) {
        res.json(error)
    }
}

// comment details
const detailsctrl = async (req,res)=>{
    try {
        res.json({msg:"comments details"})
    } catch (error) {
        res.json(error)
    }
}

// edit comment form
const editcommentctrl = async (req,res)=>{
    try {
        const comment = await Comment.findById(req.params.id);
        const userData = await getUserData(req);
        console.log("hello")
        res.render("editcomment.ejs", {
            title: "Comment",
            comment,
            // user: req.user,
            username: userData.username,
            error: "",
            success: "",
          });
    } catch (error) {
        res.status(500).json({ error: "Failed to load edit form" })
    }
}
// update comment
const updatectrl = async (req,res)=>{
    try {
        const { message } = req.body;
        const comment = await Comment.findById(req.params.id);
        comment.message = message;
        await comment.save();
        res.redirect(`/posts/${comment.post}`);
    } catch (error) {
        res.json(error)
    }
}

// delete comment
const deletectrl = async (req,res)=>{
    try {
        const comment = await Comment.findById(req.params.id);
        const postid=req.params.id
        const post=await Post.findById(postid)
        // Remove comment reference from post
        await Post.findByIdAndUpdate(comment.post, {
            $pull: { comment: comment._id }
        });
        // Remove comment reference from user
        await User.findByIdAndUpdate(comment.user, {
            $pull: { comment: comment._id }
        });
        // Delete the comment
        await Comment.findByIdAndDelete(comment._id);
        res.redirect(`//posts`)
    } catch (error) {
        res.json(error)
    }
}

module.exports={
    isAuthenticated,createctrl,detailsctrl,updatectrl,deletectrl,editcommentctrl
}