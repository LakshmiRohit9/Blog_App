const mongoose=require("mongoose")

const UserSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true,
        trim :true
    },
    email:{
        type:String,
        required:true,
        trim :true
    },
    password:{
        type:String,
        required:true,
    },
    pfp:{
        type:Object,
        public_id : String,
        url : String,
    },
    post:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Post",
    }],
    comment:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Comment",
    }],
},
{
    timestamps:true,
})

const User=mongoose.model("User",UserSchema)

module.exports=User