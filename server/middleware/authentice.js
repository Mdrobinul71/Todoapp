const jwt=require('jsonwebtoken');
const User=require('../model/userSchema');

const authenticate=async (req,res,next)=>{
    try{
        //this token bring from browser cookies
        const token=req.cookies.jwtoken;

         //this is from jwt i recived user information from browser cookie
         // and veryfiy with secretkey
        //if secret key is right verifytoken inside have all user information
        const varifayToken=jwt.verify(token,process.env.SECRET_KEY);

        //every user have unique id if user id and varifayToken.id are sane
        //schema tokens:token and my browser token same than only create rootUser
        const rootUser=await User.findOne({_id:varifayToken._id,"tokens.token":token})

        if(!rootUser){throw new Error("user not found")}

        req.token=token; //this one work like req.body
        req.rootUser=rootUser;
        req.userID=rootUser._id;
        next();

    }catch(err){
        res.status(401).send("unathorized:no token found");
        console.log(err);
    }

}

module.exports=authenticate;

/*
const jwt = require("jsonwebtoken");
const User = require("../model/userSchema");

const authentice = async function (req, res, next) {
  try {
    const tokenjwt = req.cookies.jwtoken;
    const jwtveryfy = jwt.verify(tokenjwt, process.env.SECRET_KEY);
    const rootUser = await User.findOne({
      _id: jwtveryfy._id,
      "tokens.token": tokenjwt,
    });
    req.rootUser = rootUser;
    req.token = tokenjwt;
    req.Userid = rootUser._id;
    next();
  } catch (err) {
    res.status(401).send("unathorized:no token found");
    console.log(err);
  }
};

module.exports=authentice;

*/
