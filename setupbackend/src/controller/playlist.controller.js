import playlists from "../model/playlist.model.js"
import {asynchandler} from "../utils/asynchandle.js"
import {reshandler} from "../utils/reshandler.js"
import {Apierrorhandler} from "../utils/Apierrorhandler.js"
import { isValidObjectId } from "mongoose"

const createPlaylist = asynchandler(async(req,res) => {
    const {name , description} = req.body
    if(!name || !discription) {
        throw new Apierrorhandler("name and discription is not mention" , 404)
    }

    const Playlist = await playlists.create(
        {
            name,
            description,
            owner: req.user?.id
        }
    );

    return res
    .status(200)
    .json(new reshandler(200,{Playlist},"playlist created successfully"))

})

const deletePlaylist = asynchandler(async(req,res) => {
    const {PlaylistId} = req.params

    if(!PlaylistId) {
        throw new Apierrorhandler("playlistId not found", 404)
    }

    const deletePlaylist = await playlists.findByIdAndDelete(PlaylistId)

    if(!deletePlaylist) {
        throw new Apierrorhandler("playlist not deleted successfully",304)
    }

    return res.status(200).json("playlist was deleted")

})

const updatePlaylist = asynchandler(async(req,res) => {
    const {PlaylistId} = req.params
    const {name, discription} = req.body

    if(!PlaylistId) {
        throw new Apierrorhandler("playlist id not found", 404)
    }

    if(!name || !discription) {
        throw new Apierrorhandler("name and discription not found", 404)
    }

    const updatedPlaylist = await playlists.findByIdAndUpdate(PlaylistId, {
        $set: {
            name: name,
            description: discription
        }
    })

    return res.status(200).json(new reshandler(200,{updatedPlaylist},"update playlist details"))
})

const GetPlaylistById = asynchandler(async(req,res) => {
    const {PlaylistId} = req.params

    if(!PlaylistId){
        throw new Apierrorhandler("playlist id not found", 404)
    }

    if(!isValidObjectId(PlaylistId)){
        throw new Apierrorhandler("playlist is not valid", 404)
    }

    const playlist = await playlists.findById(PlaylistId)

    return res.status(200).json(new reshandler(200,{playlist},"successfully fetch playlist by ID"))
})

const GetUserPlaylist = asynchandler(async(req,res) => {
    const {userId} = req.params

    if(!userId) {
        throw new Apierrorhandler("user ID not found", 404)
    }

    const findplaylist = await playlists.find({
        owner: userId
    })

    return res.status(200).json(new reshandler(200,{findplaylist}, "successfully find playlist by ID"))
})

const AddVideoToPlaylist = asynchandler(async(req,res) => {
    const {videoId, playlistId} = req.params

    if(!videoId) {
        throw new Apierrorhandler("not enter video id " , 404)
    }

    if(!playlistId ) {
        throw new Apierrorhandler("no playlist id",300)
    }

    const playlist = await playlists.findByIdAndUpdate(playlistId, 
        { $push: {videos: videoId}  }, 
        { new:true, useFindAndModify: false}
)    

return res.status(200).json(new reshandler(200, {playlist},"add video in playlist successfully"))
})

const RemoveVideoFromPlaylist = asynchandler(async(req,res) => {
    const {videoId, playlistId} = req.params

    if(!videoId) {
        throw new Apierrorhandler("not enter video id " , 404)
    }

    if(!playlistId ) {
        throw new Apierrorhandler("no playlist id",300)
    }

    const deletevideo = await playlists.findByIdAndUpdate(playlistId,
        { $pull: {videos: videoId}},
        {new: true}
        )
        return res.status(200).json(new reshandler(200,{deletevideo},"delete video successfully"))
})


export {
    createPlaylist,
    deletePlaylist,
    updatePlaylist,
    AddVideoToPlaylist,
    GetPlaylistById,
    GetUserPlaylist,
    RemoveVideoFromPlaylist,
    
}