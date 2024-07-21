import { Router } from "express";
import userscontrol from "../controller/user.controller.js";
import { upload } from "../middleware/multer.mid.js";

const router = Router();

router.route("/register").post(
  upload.fields([
    {name: "avatar", maxCount: 1},
    { name: "coverimg", maxCount: 1}
  ]),
  // upload.single("avatar"),
   userscontrol,
   
);

export default router;
