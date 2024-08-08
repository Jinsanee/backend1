import { Router } from "express";
import {userscontrol, loginuser, logoutUser} from "../controller/user.controller.js";
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
router.route("/login").post(loginuser)
router.route("/logout").post(verifyJWT, logoutUser)

export default router;
