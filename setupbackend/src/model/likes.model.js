import mongoose, { Schema } from "mongoose";

const likeschema = new mongoose.Schema( {
    
    comment: {
        type: Schema.Types.ObjectId,
        ref: "comment"
    }, 
    video: {
        type: Schema.Types.ObjectId,
        ref: "video"
    },
    tweet: {
        type: Schema.Types.ObjectId,
        ref: "tweet"
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }

}, {
    timestamp: true
} )

export const likes = mongoose.model("Like", likeschema)