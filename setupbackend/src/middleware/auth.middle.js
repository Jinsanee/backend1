import { asynchandler } from "../utils/asynchandle.js"
import { User } from "../model/User.model.js";
import { Apierrorhandler } from "../utils/Apierrorhandler.js";
import jwt from "jsonwebtoken";

export const verifyJWT = asynchandler(async (req,res,next) => {
   try {
     const Token = req.cookies?.accesstoken || req.header("Authorization")?.replace("Bearer ", "") 
    //  console.log(req.cookies)
     if(!Token) {
         throw new Apierrorhandler("no access token", 401)
     }
     const verifyToken = jwt.verify(Token, process.env.ACCESS_TOKEN_SECRET)
 
     const user = await User.findById(verifyToken?._id).select("-password -refreshToken");
     console.log(user)
     if(!user) {
         throw new Apierrorhandler("invalid access token " , 401)
     }
     req.user = user;
     next()
   } catch (error) {
    throw new Apierrorhandler(error?.message, 401)
   }


});
