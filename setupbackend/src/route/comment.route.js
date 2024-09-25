import { Router} from "express";
import  { addComment, UpdateComment, deleteComment, getVideoComments } from "../controller/comment.controller.js"
import { verifyJWT } from "../middleware/auth.middle.js";

const  router = Router()

router.use(verifyJWT)

router.route("/videoId").get(getVideoComments).post(addComment)
router.route("/commentId").delete(deleteComment).patch(UpdateComment)

export default router
