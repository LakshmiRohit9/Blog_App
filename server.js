require("dotenv").config()
const express = require("express");
// const serverless = require("serverless-http");
const userroute = require("./routes/users/Userroute.js");
const postroute = require("./routes/posts/Postroute.js");
const commentroute = require("./routes/comments/Commentroute.js");
const authRoutes = require("./routes/Author/Authorroute.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const cookieParser = require("cookie-parser");
const methodOverride = require("method-override")




require("./config/dbConnect.js");
const app = express();

app.set('view engine','ejs')
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
app.use(methodOverride("_method"))



//middlewares

//routes
// USER ROUTES
app.use('/api/v1/users',userroute)
// AUTHOR ROUTES
app.use("/api/v1/auth", authRoutes);

// POST ROUTES
app.use('/api/v1/posts',postroute)

// COMMENT ROUTES
app.use('/api/v1/',commentroute)

// app.use(errorHandler)

//Error handler middlewares
//listen server
const PORT = process.env.PORT || 3000;
app.listen(PORT, console.log(`Server is running on PORT ${PORT}`));

// Export as serverless function
// module.exports = serverless(app);