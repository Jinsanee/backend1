import { Router, Router } from "express";
import { commentlike, tweetlike, videoslike, likedvideos, liketweets, likecomments,  } from "../controller/likes.controller.js"
import { verifyJWT } from "../middleware/auth.middle.js";

const router = Router()

router.use(verifyJWT);

router.route("/:commentId").post(commentlike)
router.route("/:tweetId").post(tweetlike)
router.route("/:VideoId").post(videoslike)
router.route("/Likedvideos").get( verifyJWT, likedvideos)

export default router;