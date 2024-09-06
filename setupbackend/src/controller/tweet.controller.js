import { asynchandler } from "../utils/asynchandle.js";
import { Apierrorhandler } from "../utils/Apierrorhandler.js";
import { reshandler } from "../utils/reshandler.js";
import {Tweet} from "../model/tweets.model.js"
import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../model/User.model.js";


//create tweet
const createTweet = asynchandler(async(req,res) => {
    const {content} = req.body
    const user = req.user._id

    const tweet = await Tweet.create({
        content,
        owner: user
    })
    res.status(200).json(new reshandler(200,tweet,"tweet create successfully"))
})


//update tweet
const UpdateTweet = asynchandler(async(req,res) => {
    const {content} = req.body
    const {tweetId}  = req.params

    if(!content) { 
        throw new Apierrorhandler("content is empty")
    }

    const reTweet = await Tweet.findByIdAndUpdate(tweetId, 
        {$set:
             {
                content : content
            }},
        {
            new: true
        }
    )

    return res.status(200)
    .json(new reshandler(200,reTweet,"tweet update successfully"))
})


//delete tweet
const DeleteTweet = asynchandler(async(req,res) => {
    const {tweetId} = req.params

    if(!tweetId) {
        throw new Apierrorhandler("tweet id is not valid", 404)
    }

    const deletetweet = await Tweet.findByIdAndDelete(tweetId)

    if(!deletetweet) {
        throw new Apierrorhandler("somthing went wrong while deleting the tweet",303)
    }

    return res
    .status(200)
    .json(new reshandler(200,{},"delete tweet successfully"))
})

// GET User Tweet : <PENDING>

export {createTweet,
    UpdateTweet,
    DeleteTweet
}