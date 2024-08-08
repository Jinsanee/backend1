import mongoose, {Schema} from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"

const UserSchema = new Schema(
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

UserSchema.pre("save", async function(next) {
if(!this.isModified("password")) return next();
       this.password = await bcrypt.hash(this.password, 10)
        next()
        console.log(this.password)
})

UserSchema.method.passwordcheck = async function (password) {
  return await bcrypt.compare(this.password, password)
}

UserSchema.methods.accessgenrator = function () {
    return jwt.sign( {
        _id: this._id,
        username: this.username,
        fullname: this.fullname,
        email: this.email
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    }
)
}
UserSchema.methods.refreshgenrator = function () {
    return jwt.sign( {
        _id: this._id,
    },
    process.env.REFRESH_TOEKN_SECRET,
    {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    }
)   
}

export const User = mongoose.model("User", UserSchema)



