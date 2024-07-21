import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import router from "./route/user.route.js";

const app = express();

app.use(cors({
    origin: true,
    credentials: true
}));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static( "public"));
app.use(cookieParser());

app.use("/api/v1/users", router);
console.log("app file")
export default app;
// http://localhost:8000/api/v1/users/register