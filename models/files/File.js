const mongoose=require("mongoose")

const FileSchema=new mongoose.Schema({
    url:{
        type:String,
        required:true,
        trim :true
    },
    public_id:{
        type:String,
        required:true,
    },
    category:{
        type:String,
        enum:['happy','sad','anger','excited','other']
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
},
{
    timestamps:true,
})

const File=mongoose.model("File",FileSchema)

module.exports=File