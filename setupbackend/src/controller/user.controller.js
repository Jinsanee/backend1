import { asynchandler } from "../utils/asynchandle.js";
import { Apierrorhandler } from "../utils/Apierrorhandler.js";
import { User } from "../model/User.model.js";
import { uploader } from "../utils/Cloudinary.js";
import { reshandler } from "../utils/reshandler.js";
import jwt from "jsonwebtoken";
import { json } from "express";

//gernate access and refresh token
const GernateAccessandRefreshToken = async (userid) => {
  try {
    const user = await User.findById(userid)
    console.log(user._id)
    const AccessToken = await user.accessgenrator()
    const refreshToken = await user.refreshgenrator()
 
    user.refreshToken = refreshToken
    await user.save({
       validateBeforeSave : false
    })
    return {AccessToken, refreshToken}
  } catch (error) {
   throw new Apierrorhandler(error.message   , 400)
  }
}

//REGISTER USER
const userscontrol = asynchandler(async (req, res) => {
   const { fullname, username, email, password } = req.body;

   // Validate required fields
   if ([fullname, email, username, password].some(field => !field || field.trim() === "")) {
      throw new Apierrorhandler("All fields are required", 400);
   }

   // Validate email format
   if (!email.includes('@') || !email.includes('.', email.indexOf('@'))) {
      throw new Apierrorhandler("Email is not correct", 400);
   }

   // Validate password length
   if (password.length < 8) {
      throw new Apierrorhandler("Password length is too short", 400);
   }

   // Check if user already exists
   const existedUsercheck = await User.findOne({
      $or: [{ username }, { email }],
   });
   if (existedUsercheck) {
      throw new Apierrorhandler("Username or email is already used", 400);
   }

   // Handle avatar file upload
   // console.log(req.files)
   const avatarLocalPath = req.files.avatar?.[0].path;
   if (!avatarLocalPath) {
      throw new Apierrorhandler("Avatar is required1", 400);
   }

   // Handle cover image file upload 
   const coverImgLocalPath = req.files?.coverimg?.[0]?.path;
   // console.log('req file',req.files)
   // if (!coverImgLocalPath) {
   //    console.log("Cover image file not uploaded or path not found");
   // } else {
   //    console.log("Cover image file path:", coverImgLocalPath);
   // }

   // Upload avatar
   const avatar = await uploader(avatarLocalPath);
   if (!avatar) {
      throw new Apierrorhandler("Avatar upload failed", 400);
   }

   // Optionally upload cover image
   const coverimg = coverImgLocalPath ? await uploader(coverImgLocalPath) : null;

   // Create user
   
   const user = await User.create({
      fullname,
      email,
      password,
      coverimg: coverimg?.url || "",
      username: username.toLowerCase(),
      avatar: avatar.url
      
   });

   if (!user) {
      throw new Apierrorhandler("User creation failed, try again", 400);
   }

   // Fetch created user without password and refreshToken
   const createduser = await User.findById(user._id).select("-password -refreshToken");

   if (!createduser) {
      throw new Apierrorhandler("Server issue, please report this problem", 500);
   }

   return res.status(200).json(new reshandler(200, createduser, "User registered successfully"));
});

//login USER 
const loginUser = asynchandler(async (req, res) => {
   //req.body data
   const {username , email, password} = req.body;
    

   //check username or email

   if ( !email && !username) {
      throw new Apierrorhandler("please enter username or email ", 400)
   }
   // if (Y) then continue else (N) register please
   const user = await User.findOne( {
      $or: [{username},{email}]
   })

   if(!user) {
      throw new Apierrorhandler("not registered user", 400)
   }
   // console.log(user );

   // password check

   const passwordverification =  await user.passwordcheck(password)

   if(!passwordverification) {
      throw new Apierrorhandler (" wrong password", 400)
   }
   // access and refresh token
   const {AccessToken, refreshToken} =await GernateAccessandRefreshToken(user._id)

   const loginUserID = await User.findById(user._id).select("-password -refreshToken")

   const options = {    
      httpOnly: true,   
      secure: true
   }

   return res.status(200).cookie("accesstoken",AccessToken ,options)
   .cookie("refreshtoken", refreshToken, options)
   .json(
      new reshandler(200, 
         {
            AccessToken, refreshToken

         },
         "login successfully")
   )
});

//logout USER
const logoutUser = asynchandler(async(req,res) => {
   await User.findByIdAndUpdate(req.user._id, {
      $set: {
         refreshToken: undefined
      }
   },
   {
      new: true
   })
   const options = {    
      httpOnly: true,
      secure: true
   }

   return res
   .status(200)
   .clearCookie("accesstoken", options) // check again the cookies is clear or not  
   .clearCookie("refreshToken", options)
   .json(new reshandler(200,{},"logout successfully"))
})

//TOKEN reload
const RefreshAccessToken = asynchandler(async(req,res) => {
   try {
      const USERrefreshtoken = req.cookies.refreshToken || req.body.refreshToken
       if (!USERrefreshtoken) {
         throw new Apierrorhandler("refresh token in valid", 402)
       }
       const verifyToken = jwt.verify(USERrefreshtoken,process.env.REFRESH_TOEKN_SECRET)
       if(!verifyToken) {
         throw new Apierrorhandler("not verify refresh token", 400)
       }
   
       const user = User.findById(verify?._id)
       if(!user) {
         throw new Apierrorhandler("user not exsist in verify token",400   )
       }
   
       if(USERrefreshtoken !== user.refreshToken) {
         throw new Apierrorhandler("token is not verify", 400)
       }
   
       const {AccessToken, refreshToken} =await GernateAccessandRefreshToken(user._id)
       const options = {    
         httpOnly: true,
         secure: true
      }
   
      return res
      .status(200)
      .cookie("AccessToken", AccessToken, options)
      .cookie("refreshToken ", refreshToken, options)
      .json(
         new reshandler(200,
            {AccessToken, refreshToken},
            "gernate accessToken successfully"
         )
      )
   } catch (error) {
      throw new Apierrorhandler(error)
   }

})

//PASSWORD change
const passwordchange = asynchandler(async(req,res) => {
   const {oldpassword, newpassword, confpassword} = req.body
   
   const user = await User.findById(req.user?._id)

   const correctpassword = await user.passwordcheck(oldpassword)

   if(!correctpassword) {
      throw new Apierrorhandler("password is not correct",402)
   }
   if(!(newpassword === confpassword)) {
      throw new Apierrorhandler("newpassword not same",402)
   }
   
   user.password = newpassword
   await user.save({validateBeforeSave : false})

   return res.status(200)
   .json(new reshandler(200,{},"successfully password changed"))
})

//GETcurrentUser
const getcurrentUser = asynchandler (async(req,res) => {
   return res.status(200)
   .json(new reshandler(200, req.user, "current user fetch successfully"))
})

//UPDATE account details
const updateAccountDetails = asynchandler (async(req,res) => {
   const {fullname, email} = req.body
   // const user = getcurrentUser()
   // if(fullname) {user.fullname = fullname}
   // if(email) {user.email = email }

   if(!fullname || !email) {
      throw new Apierrorhandler("fullname and email is required", 409)
   }

   const user = User.findByIdAndUpdate(req.user._id,
   {
      $set: {
         fullname,
         email : email
      } 
   }, {new: true}).select("-password")

   return res.status(200)
   .json (new reshandler(200, {}, "account details update successfully  "))

})

//AVATAR image change
const Avatarupdate = asynchandler(async(req, res) => {
   const avatarlocalpath = req.file?.path
   if(!avatarlocalpath) {
      throw new Apierrorhandler("avator local path doesnot recive", 407)
   }
   const avatar = await uploader(avatarlocalpath)

   if(!avatar.url) {
      throw new Apierrorhandler("avatar img is not upload" , 409)
   }

   const user = await User.findByIdAndUpdate(req.user?._id,{
      $set: {
         avatar: avatar.url
      }
   },{new: true}).select("-password")

   return res.status(200)
   .json(new reshandler(200, {},"avatar image have been changed"))
})

//COVER image change
const Coverimageupdate = asynchandler(async(req,res) => {
   const coverImgLocalPath = req.file?.path

   if(!coverImgLocalPath) {
      throw new Apierrorhandler("cover local path doesnot recive" , 409)
   }

   const coverimg = await uploader(coverImgLocalPath)

   const user =await User.findByIdAndUpdate(req.user?._id,{
      $set: {
         coverimg: coverimg.url
      }
   },{new: true}).select("-password")

   return res.status(200)
   .json(new reshandler(200, {},"cover image have been changed"))
})

//pipeline
const GetUserChannalProfile = asynchandler(async(req,res) => {
   const {username} = req.params

   if(!username?.trim) {
      throw new Apierrorhandler("username don't get it", 403)
   }

   const channal = await User.aggregate([
      {
         $match:{ 
            username: username?.toLowerCase
         }
      },{
         $lookup: {
            from: "subcriptions",
            localfield: "_id",
            foreignField: "channal",
            as: "subscribers"
         }
      },{
         $lookup: {
            from: "subcriptions",
            localField: "_id",
            foreignField: "subscriber",
            as: "subscribedTo"
         }
      }, {
         $addFields: {
            subscriberscount: {
               $size: "$subscribers"
            },
            channalsubscriberdcount: {
               $size: "$subscribedTo"
            },
            isSubscriberd: {
               $cond: {
                  if: {$in: [req.user?._id, "$subscribers.subscriber"]},
                  then: true,
                  else: false
               }     
            }
         }
      }, {
         $project: {
            fullname: 1,
            username: 1,
            email: 1,
            channalsubscriberdcount: 1,
            subscriberscount: 1,
            avatar: 1,
            coverimg: 1
         }
      }
   ])
      //console.log(channal)
      if(!channal?.length) {
         throw new Apierrorhandler("channal dont fetched", 403)
      }
   return res
   .status(200)
   .json(new reshandler(200,channal[0], "channal data fetch successfully" ))
})

//watchhistory

//likes and cmts

export {
   userscontrol, 
   loginUser, 
   logoutUser,
   RefreshAccessToken,
   passwordchange,
   getcurrentUser,
   updateAccountDetails,
   Avatarupdate,
   Coverimageupdate,
   GetUserChannalProfile
}
