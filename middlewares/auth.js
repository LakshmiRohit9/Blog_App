const jwt = require("jsonwebtoken");

let loggedinuser=''


const isAuthenticated = (req, res, next) => {
    //Access the token from req.cookies
    const token = req.cookies ? req.cookies.token : null;
    //redirect
    if (!token) {
      return res.redirect("/api/v1/auth/login");
    }
    //Verify the token
    jwt.verify(token, "anykey", (err, decoded) => {
      if (err) return res.redirect("/login");
      //Add the user into the req obj
      req.userData = decoded;
      loggedinuser=req.userData
      next();
    });
};

module.exports={isAuthenticated,loggedinuser}