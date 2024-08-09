import mongoose, {Schema} from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import { Apierrorhandler } from "../utils/Apierrorhandler.js";

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            index: true,
            lowercase: true,
            trim: true
        },
        password: {
            type: String,
            required: true,
        },
        fullname: {
            type: String,
            required: true,
            index: true,
            lowercase: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            index: true,
            lowercase: true,
            trim: true
        },
        watchhistory: {
            type: Schema.Types.ObjectId,
            ref: "video"
        },
        avatar:  {
            type:String,
            required: true
        },
        coverimg: {
            type : String
        },
        refreshToken : {
            type : String
        }
        
    }, {
        timestamps: true
    }
)

userSchema.pre("save", async function(next) {
if(!this.isModified("password")) return next();
       this.password = await bcrypt.hash(this.password, 10)
       console.log(this.password)
        next()
})

// userSchema.methods.passwordcheck = async function (password) {
//     console.log(password)
//   return await bcrypt.compare(password ,this.password);
// }

userSchema.methods.passwordcheck = async function(password){
    return await bcrypt.compare(password, this.password)
    // console.log(password)
}

// userSchema.method('passwordchecks',async function () {
//     return await bcrypt.compare(password, this.password)
//   })

userSchema.methods.accessgenrator = async function () {
    try {
        return jwt.sign({
            _id: this._id,
            // username: this.username,
            // fullname: this.fullname,
            // email: this.email
        }, process.env.ACCESS_TOKEN_SECRET,
            {
                expiresIn: process.env.ACCESS_TOKEN_EXPIRY
            }
        )
    } catch (error) {
        throw new Apierrorhandler(error.message, 404)
    }
}
userSchema.methods.refreshgenrator = function () {
    return jwt.sign( {
        _id: this._id,
    },
    process.env.REFRESH_TOEKN_SECRET,
    {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    }
)   
}

export const User = mongoose.model("User", userSchema)



