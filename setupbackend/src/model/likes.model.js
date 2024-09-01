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
    likeby: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    tweet: {
        type: Schema.Types.ObjectId,
        ref: "tweet"
    }

}, {
    timestamp: true
} )

export const Like = mongoose.model("Like", likeschema)