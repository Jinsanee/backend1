import {asynchandler} from "../utils/asynchandle.js"
import {reshandler} from "../utils/reshandler.js"
import {Apierrorhandler} from "../utils/Apierrorhandler.js"
import {comments} from "../model/comment.model.js"
import { isValidObjectId } from "mongoose"
import { application } from "express"

// all actions on Video 
const addComment = asynchandler(async(req,res) => {
    const {VideoId} = req.params
    const {content} = req.body

     if(!isValidObjectId(VideoId)) {
        throw new Apierrorhandler("video Id not valid",401)
     }

     const comment = await comments.create({
        video: VideoId,
        content: content,
        owner: req.user?._id
     })

     if(!comment) {
        throw new Apierrorhandler("comment not add propery", 500)
     }

     return res.status(200).json(new reshandler(200,{comment},"comment add successfully"))
})

const UpdateComment = asynchandler(async(req,res) => {
    const {VideoId}= req.params
    const {content} = req.body
    const updateComment = comments.findByIdAndUpdate(VideoId,{
        $set: {
            content: content
        }
    }, {new: true})

    return res.status(200).json(new reshandler(200,{updateComment},"comment update successfully"))
})


const deleteComment = asynchandler(async(req,res) => {
    const {CommentId} = req.params

    if(!isValidObjectId(CommentId)) {throw new Apierrorhandler("invalid CommentId",400)}
    await comments.findByIdAndDelete({_id: CommentId})

    return res.status(200).json(new reshandler(200,{},"comment delete successfully"))

})


const getVideoComments = asynchandler(async(req,res) => {
// TODO >> logical problem
})



export {
    addComment,
    UpdateComment,
    deleteComment,
    getVideoComments
}