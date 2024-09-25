import { asynchandler } from "../utils/asynchandle.js";
import { Apierrorhandler } from "../utils/Apierrorhandler.js";
import { uploader } from "../utils/Cloudinary.js";
import { reshandler } from "../utils/reshandler.js";
import { Video } from "../model/Video.model.js";
import mongoose, { isValidObjectId } from "mongoose";

//video file > upload > cloudenry > link , duration , title , description > view > isPublished > owner

const getallvideos = asynchandler(async(req,res) => {
        const { 
            page = 1, 
            limit = 10, 
            query = "", 
            sortBy = "createdAt", 
            sortType = "desc", 
            userId 
        } = req.query;
    
        // Convert page and limit to integers
        const pageNumber = parseInt(page);
        const limitNumber = parseInt(limit);
    
        // Set up the filter
        let filter = {};
    
        if (query) {
            // Search for videos by title, description, or other fields
            filter = {
                $or: [
                    { title: { $regex: query, $options: "i" } }, // Case insensitive search for title
                    { description: { $regex: query, $options: "i" } } // Case insensitive search for description
                ]
            };
        }
    
        if (userId) {
            // Optionally filter by the user who uploaded the video
            filter.owner = userId;
        }
    
        // Sorting options
        let sortOptions = {};
        if (sortBy) {
            sortOptions[sortBy] = sortType === "asc" ? 1 : -1; // Ascending or descending sort
        }
    
        try {
            // Get total count of matching videos
            const totalVideos = await Video.countDocuments(filter);
    
            // Fetch videos with pagination, filtering, and sorting
            const videos = await Video.find(filter)
                .sort(sortOptions)
                .skip((pageNumber - 1) * limitNumber)
                .limit(limitNumber);
    
            // Send response
            res.status(200).json({
                totalVideos,
                currentPage: pageNumber,
                totalPages: Math.ceil(totalVideos / limitNumber),
                videos
            });
        } catch (error) {
            res.status(500).json({ message: "Error fetching videos", error });
        }
})

const videoupload = asynchandler(async(req,res) =>  {
    const { title, discreption } = req.body

    if(!(title & discreption)) {
        throw new Apierrorhandler("title and description is missing")
    }

    const videolocalpath = req.files?.Videofile[0]?.path
    const thumbnaillocalpath = req.files?.thumbnail[0]?.path

    if(!videolocalpath && !thumbnaillocalpath) {
        throw new Apierrorhandler("local path is not defined of video and thumbnail", 404)
    }

    const Video =await uploader(videolocalpath)
    const thumbnail = await uploader(thumbnaillocalpath)

    if(!Video && !thumbnail) {
        throw new Apierrorhandler("video and thumbnail is not upload on cloudnery", 403)
    }

    const publishVideo = await Video.create({
        title,
        discreption,
        Videofile: {
            url: Video.secure_url,
            public_id: Video.public_id
        },
        thumbnail: {
            url: thumbnail.secure_url,
            public_id: thumbnail.public_id
        } ,
        duraction : Video.duraction,
        owner : ref.user._id
    })

    return res
    .status(200)
    .json( new reshandler(200,publishVideo, "video is published"))
})

const getVideoId = asynchandler(async(req,res) => {
    const {VideoId} = req.params

    if(!isValidObjectId(VideoId)) {
        throw new Apierrorhandler("video Id is not validate")
    }
    const video = await Video.findById(VideoId)
    if(!video) {
        throw new Apierrorhandler("video not found in database",404)
    }

    return res.status(200)
    .json(new reshandler(200,video,"find video successfully by ID"))
})

const upadateVideodetails = asynchandler(async(req,res) => {
        const {videoid} = req.params
    
        const updatevalue = {
        title: req.body.title,
        discreption: req.body.discreption,
        }

        const video = await Video.findById(videoid)

        if(req.file.path !== "") {
        await destroyCloudImage(video.thumbnail.public_id)
        }

        const thumbnaillocalpath = req.file.path

        const thumbnail = uploader(thumbnaillocalpath)

        if(!thumbnail) {
        throw new Apierrorhandler("thumbnail is not upload", 200)
        }

        updatevalue.thumbnail = {
        url: thumbnail.secure_url,
        public_id: thumbnail.public_id
        }

        const updatevideodetails = await Video.findByIdAndUpdate(videoid,updatevalue, {
            new: true
        } )

        return res.status(200)
        .json( new reshandler(201,updatevideodetails, "video details update successfully"))
})

const deleteVideo = asynchandler(async(req,res) => {
    const {videoid} = req.params
    if(isValidObjectId(videoid)) {
        throw new Apierrorhandler("invalid video id", 404)
    }

    const video = await Video.findById(videoid)

    await destroyCloudImage(video.thumbnail.public_id)

    await destroyCloudVideo(video.Videofile.public_id)

    await Video.findByIdAndDelete(videoid)

    return res.status(200).json( new reshandler(200,{}, "delete Video successfully"))
})

const togglevideostatus = asynchandler(async(req,res) => {
    const {videoId} = req.params

    if(!isValidObjectId(videoId)) {
        throw new Apierrorhandler("video ID not found", 404)
    }

    const UpdateToggleVideo = Video.findByIdAndUpdate(videoId,
        {$set: 
            {
                inPublish: !inPublish
            }}, {
                new: true
            })

            if(!UpdateToggleVideo) {
                throw new Apierrorhandler("video toggle is not updated", 401)
            }

            return res
            .status(200)
            .json( new reshandler(200,{UpdateToggleVideo}, "toggle update successfully"))
})

export {
    videoupload,
    getVideoId,
    upadateVideodetails,
    deleteVideo,
    togglevideostatus,
    getallvideos
}
