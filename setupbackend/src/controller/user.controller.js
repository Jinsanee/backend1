import { asynchandler } from "../utils/asynchandle.js";
import { Apierrorhandler } from "../utils/Apierrorhandler.js";
import { User } from "../model/User.model.js";
import { uploader } from "../utils/Cloudinary.js";
import { reshandler } from "../utils/reshandler.js";

//gernate access and refresh token

const GernateAccessandRefreshToken = async (userid) => {
   const user = User.findById(userid)
   const AccessToken = user.accessgenrator()
   const RefreshToken = user.refreshgenrator()

   user.refreshToken = RefreshToken()
   await user.save({
      validateBeforeSave : false
   })
   return {AccessToken, RefreshToken}
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

const loginuser = asynchandler(async (req, res) => {
   //req.body data
   const {username , email, password} = req.body;
    

   //check username or email

   if (!username || ! email ) {
      throw new Apierrorhandler("please enter username or email ", 400)
   }
   // if (Y) then continue else (N) register please
   const user = user.findOne( {
      $or: [{username},{email}]
   })

   if(!user) {
      throw new Apierrorhandler("not registered user", 400)
   }

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
   .clearCookie("AccessToken", options)
   .clearCookie("refreshToken", options)
   .json(new reshandler(200,{},"logout successfully"))
})

export default {userscontrol, loginuser, logoutUser}
