import { Router, Router } from "express";
import { videoupload, getVideoId, upadateVideodetails,
deleteVideo, togglevideostatus, getallvideos} from "../controller/video.controller.js"

import { upload } from "../middleware/multer.mid.js";
import { verifyJWT } from "../middleware/auth.middle.js";


const router = Router();

router.use(verifyJWT);

router.route("/").get(getallvideos).post(
    upload.fields([
        {
            name: "videofile",
            maxCount: 1
        },{
            name: "thumbnail",
            maxCount: 1
        }
    ]),
    videoupload
);

router.route("/:videoId").get(getVideoId).delete(deleteVideo).patch(upload.single("thumbnail"), upadateVideodetails)

router.route("/toggle/publish/:videoId").patch(togglevideostatus)

export default router