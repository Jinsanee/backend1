import dotenv from "dotenv"
import connectDB from "./db/index.js";

dotenv.config( {
    path : "./env"
})

connectDB()



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