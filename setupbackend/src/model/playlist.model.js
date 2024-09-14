import mongoose, { Schema } from "mongoose";

const playlistSchema = new mongoose.Schema( {

    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    videos: [
       { type: Schema.Types.ObjectId,
        ref: videos,}
    ],
    owner: {      
        type: Schema.Types.ObjectId,
        ref: "User"
    }

},
{  
     timestamps: true
} 
)

export const playlists = mongoose.model("Playlist", playlistSchema )