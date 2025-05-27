const mongoose = require("mongoose");
// const url='mongodb+srv://tlakshmirohit:0NHKK2BNZ5uXUhvh@blogdb.usoo9.mongodb.net/BlogApp?retryWrites=true&w=majority&appName=blogDB'
const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("DB Connected Successfully");
  } catch (error) {
    console.log("DB Connection failed", error.message);
  }
};

dbConnect();