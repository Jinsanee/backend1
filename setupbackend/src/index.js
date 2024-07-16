import dotenv from "dotenv"
import connectDB from "./db/index.js";
import app from "./app.js";

dotenv.config( {
    path : "./env"
})

connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
    })
})
.catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
})




// const app = express()

// ;(async() => {
//     try {
//         await mongoose.connect(`${process.env.MONGODB}/ ${DBname}`)
//         app.on("error" , (error) => {
//             throw error
//         })
//         app.listen(process.env.PORT,() => {
//             console.log(`app is listening on port number ${process.env.PORT}`)
//         })

//     } catch (error) {
//         console.error("error:", error)
//         throw error
//     }
// }) ()