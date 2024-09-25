import { Router } from "express";
import {createTweet,
    UpdateTweet,
    DeleteTweet,
    GetuserTweet} from "../controller/tweet.controller.js"
import { verifyJWT } from "../middleware/auth.middle.js";

const router = Router()

router.use(verifyJWT)

router.route("/").post(createTweet)
router.route("/user/:userId").get(GetuserTweet)
router.route("/:tweetId").patch(UpdateTweet).delete(DeleteTweet)

export default router
