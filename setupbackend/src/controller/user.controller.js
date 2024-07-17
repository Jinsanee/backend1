import { asynchandler } from "../utils/asynchandle.js";
import { Apierrorhandler } from "../utils/Apierrorhandler.js";
import { User } from "../model/User.model.js";
import { uploader } from "../utils/Cloudinary.js";
import { reshandler } from "../utils/reshandler.js";

const userscontrol = asynchandler(async (req, res) => {
   // const userscontrol = async (req,res) => {
   //      res.status(200).json({
   //         message: "ok"
   //     })
   // }
   const { fullname, username, email, password } = req.body;
   // console.log("fullname :", fullname)

   if (
      ![fullname, email, username, password].some(
         (field) => field?.trim() === " ",
      )
   ) {
      throw new Apierrorhandler("All fields are required", 400);
   }

   // if(
   //     (email.includes('@'))
   // )  {
   //     throw new Apierrorhandler("email is not correct", 400);
   //   }// verifying

   if (password.length < 8) {
      throw new Apierrorhandler("password length is too short", 400);
   } // verifying

   const existedUsercheck = await User.findOne({
      $or: [{ username }, { email }],
   });
   if (!existedUsercheck) {
      throw new Apierrorhandler("username or email is already used", 400); // this existed user check
   }

   const Avatarlocalpath = req.files?.avatar[0]?.path;
   const coverimglocalpath = req.files?.coverimg[0]?.path;
   // console.log(Avatarlocalpath)

   if (!Avatarlocalpath) {
      throw new Apierrorhandler("avatar is required", 400);
   }

   const avatarupload = uploader(Avatarlocalpath);
   const coverimgupload = uploader(coverimglocalpath);

   if (!avatarupload) {
      throw new Apierrorhandler("avatar is required", 400);
   }

   const user = await User.create({
      fullname,
      email,
      password,
      avatarupload: avatarupload.url,
      coverimgupload: coverimgupload?.url || "",
      username: username.toLowerCase(),
   });

   if (!User) {
      throw new Apierrorhandler("user is not created try again", 400);
   }

   const createduser = await User.findById(user._id).select(
      "-password  -refreshToken ",
   );

   if (!createduser) {
      throw new Apierrorhandler(
         "this is server problem so please wait or do report while its not replair",
         500,
      );
   }

   return res
      .status(200)
      .json(new reshandler(200, createduser, "user is registerd successfully"));
});

export default userscontrol;
