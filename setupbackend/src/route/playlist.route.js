import { Router } from "express";
import  {
    createPlaylist, deletePlaylist, updatePlaylist, AddVideoToPlaylist, GetPlaylistById, GetUserPlaylist, RemoveVideoFromPlaylist,
    
} from "../controller/playlist.controller.js"
import { verifyJWT } from "../middleware/auth.middle.js";

const router = Router()

router.use(verifyJWT)
router.route("/create-playlist").post(createPlaylist)
router.route("/playlist/:PlaylistId").delete(deletePlaylist)
router.route("/playlist/:playlistId").get(updatePlaylist)
router.route("/:playlistId").post(GetPlaylistById)
router.route("/:userId").get(GetUserPlaylist)
router.route("playlist/:playlistId/videos/:videoId").put(AddVideoToPlaylist)
router.route("/playlist/playlistId/videos/:videoId").delete(RemoveVideoFromPlaylist)
