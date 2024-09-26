import {Router} from "express"
import { 
    toggleSubscription, 
    subscriberList, 
    channalList
 } from "../controller/subcription.controller.js"

 import { verifyJWT } from "../middleware/auth.middle.js";

const router = Router()

router.use(verifyJWT);
router.route("/:channalId").post(toggleSubscription)
router.route("/:channalId").post(subscriberList)
router.route("/:subscriberId").post(channalList)

export default router