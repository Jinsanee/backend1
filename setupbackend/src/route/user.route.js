import { Router } from "express";
import {userscontrol, loginUser, 
  logoutUser, RefreshAccessToken, 
  passwordchange, getcurrentUse, 
  updateAccountDetails, Avatarupdate,  
  Coverimageupdate , GetUserChannalProfile , 
  VideosWatchHistory} from "../controller/user.controller.js";
 
import { upload } from "../middleware/multer.mid.js";
import { verifyJWT } from "../middleware/auth.middle.js";

const router = Router();

router.route("/register").post(
  upload.fields([
    {name: "avatar", maxCount: 1},
    { name: "coverimg", maxCount: 1}
  ]),
  // upload.single("avatar"),
   userscontrol,
   
);
router.route("/login").post(loginUser)
router.route("/refresh-Token").post(RefreshAccessToken)
router.route("/logout").post(verifyJWT, logoutUser)
router.route("/chnage-password").post(verifyJWT, passwordchange)
router.route("/current-user").get(verifyJWT, getcurrentUse)
router.route("/update-account-deatils").patch(verifyJWT, updateAccountDetails)
router.route("/AVATAR-UPDATE").patch(verifyJWT,upload.single("avatar") , Avatarupdate)
router.route("/cover-image-UPDATE").patch(verifyJWT,upload.single("coverimg") , Coverimageupdate)
router.route("/c/:username").get(verifyJWT, GetUserChannalProfile)
router.route("history").get(verifyJWT, VideosWatchHistory)

export default router;
