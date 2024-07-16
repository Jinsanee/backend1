import { asynchandler } from "../utils/asynchandle.js";

const userscontrol = asynchandler(async (req,res) => {
    return res.status(200).json({
        message: "ok"
    })
})

// const userscontrol = async (req,res) => {
//      res.status(200).json({
//         message: "ok"
//     })
// }

export default userscontrol



