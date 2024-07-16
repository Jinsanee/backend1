import { Router } from "express";
import userscontrol from "../controller/user.controller.js";

const router = Router()

router.route("/r").get(userscontrol)
// router.get("/r", userscontrol)

export default router