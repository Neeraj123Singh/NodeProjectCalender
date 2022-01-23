const jwt = require('jsonwebtoken');
const User =require('./model/userSchema');
const secret= 'ASDFGHJKJHGFDFGHJKHDFGHKJLHTFYHGYGGCFYGHVGKHGHVGFTGHBVHGJVGYHGJY';

const Authenticate = async (req,res,next)=>{
    try{

        tokenString = req.headers['authorization'];
        tokenArray = tokenString.split(" ");
        token = tokenArray[1];
        const verifyToken = await jwt.verify(token,secret);
        const rootUser = await User.findOne({_id: verifyToken._id, token:token});
        if(!rootUser){
            throw new Error("User not found");
        }
        req.token = token;
        req.rootUser = rootUser;
        req.userId = rootUser._id;
        next();
    }catch(err){
        res.status(401).send("Unauthorised: No token Provided");
        console.log(err);
    }
}

module.exports = Authenticate;