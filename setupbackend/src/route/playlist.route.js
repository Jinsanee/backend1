import { Router } from "express";
import  {
    createPlaylist, deletePlaylist, updatePlaylist, AddVideoToPlaylist, GetPlaylistById, GetUserPlaylist, RemoveVideoFromPlaylist,
    
} from "../controller/playlist.controller.js"
import { verifyJWT } from "../middleware/auth.middle.js";

const router = Router()

router.use(verifyJWT)
router.route("/").post(createPlaylist)
router.route("/playlist/:PlaylistId").delete(deletePlaylist)
router.route("/playlist/:playlistId").patch(updatePlaylist)
router.route("/:playlistId").get(GetPlaylistById)
router.route("/user/:userId").get(GetUserPlaylist)
router.route("playlist/:playlistId/videos/:videoId").patch(AddVideoToPlaylist)
router.route("/playlist/playlistId/videos/:videoId").patch(RemoveVideoFromPlaylist)
