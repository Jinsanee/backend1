import express from "express"
import cors from "cors"
import cookieParser  from "cookie-parser"


const app = express()

app.use(cors({ 
    origin: true, 
    Credentials: true
}))

// app.use // is the configure function by express

app.use(express.json({limit: "16kb"})) // the data add in backend in a limit size & also allow json in backned
app.use(express.urlencoded({extanded: true, limit: "16kb"})) // url encode by this extanded and limit by side
app.use(express.static("public"))  // for store file by public enter in app exp -> picture
app.use(cookieParser()) // can excess the cookie of user browser


// route import
import router from "./route/user.route.js"

//route use by .use funtion
app.use("/", router)


export default app
// http://localhost:8000/users/register