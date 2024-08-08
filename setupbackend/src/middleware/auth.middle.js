import { asynchandler } from "../utils/asynchandle"
import { User } from "../model/User.model";
import { Apierrorhandler } from "../utils/Apierrorhandler";
import jwt from "jsonwebtoken";

export const verifyJWT = asynchandler(async (req,res,next) => {
   try {
     const Token = req.cookies?.AccessToken || req.header("Authorization")?.replace("Bearer ", "") 
     if(!userToken) {
         throw new Apierrorhandler("no access token", 401)
     }
     const verifyToken = jwt.verify(Token, process.env.ACCESS_TOKEN_SECRET)
 
     const user = await User.findById(verifyToken?._id).selected("-password -refreshToken");
     if(!user) {
         throw new Apierrorhandler("invalid access token " ,)
     }
     req.user = user;
     next()
   } catch (error) {
    throw new Apierrorhandler(error?.message, 401)
   }


});
