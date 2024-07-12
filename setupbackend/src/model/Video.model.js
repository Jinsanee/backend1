import mongoose , {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";


const VideoSchema = new Schema (
    {
        Videofile: {
              type: String,
                required: true
        },
        thumbnail : {
            type: String,
            required: true
        },
        title: {
            type: String,
            required: true
        },
        discreption: { type: String,
            required: true
        },
        duraction : {
            type: Number,
            required: true
        },
        View: { 
            type: Number,
            default: 0
        },
        inPublish : {
            type: Boolean,
            required: true
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    }, {
        timestamps: true
    }
)

VideoSchema.plugin(mongooseAggregatePaginate)

export const videos = mongoose.Model("video", VideoSchema)