const mongoose=require("mongoose")

const PostSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim :true
    },
    description:{
        type:String,
        required:true,
    },
    category:{
        type:String,
        enum:['happy','sad','anger','excited','other']
    },
    image:[{
        url:{type:String,
        // required:true,
    },
        public_id:{
            type:String,
            // required:true,
        }
    }],
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    comment:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Comment",
    }]
},
{
    timestamps:true,
})

const Post=mongoose.model("Post",PostSchema)

module.exports=Post