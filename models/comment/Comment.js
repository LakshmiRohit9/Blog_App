const mongoose=require("mongoose")

const CommentSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User"
    },
    message:{
        type:String,
        required:true,
    },
    post:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"Post"
    }
},
{
    timestamps:true,
})

const Comment=mongoose.model("Comment",CommentSchema)

module.exports=Comment