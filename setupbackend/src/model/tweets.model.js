import mongoose from "mongoose";

const tweetsSchema = new mongoose.Schema(
   {
      owner: {
         type: Schema.Types.ObjectId,
         ref: "User",
      },

      content: {
         type: String,
         required: true,
      }, 
   },
   {
      timestamps: true,
   },
);

export const Tweets = mongoose.model("Tweet", tweetsSchema);
