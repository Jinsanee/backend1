import {Router} from "express"
import { 
    toggleSubscription, 
    subscriberList, 
    channalList
 } from "../controller/subcription.controller.js"

 import { verifyJWT } from "../middleware/auth.middle.js";

const router = Router()

router.use(verifyJWT);
router.route("/:channalId").post(toggleSubscription).get(subscriberList)

router.route("/:subscriberId").get(channalList)

export default router