import express from express
import cors from cors
import cookieParser from cookieParser

const app = express()

app.use(cors({ 
    origin: process.env.CORS_ORIGIN, 
    Credentials: true
}))

// app.use // is the configure function by express

app.use(express.json({limit: "16kb"})) // the data add in backend in a limit size & also allow json in backned
app.use(express.urlencoded({extanded: true, limit: "16kb"})) // url encode by this extanded and limit by side
app.use(express.static("public"))  // for store file by public enter in app exp -> picture
app.use(cookieParser()) // can excess the cookie of user browser



export default app