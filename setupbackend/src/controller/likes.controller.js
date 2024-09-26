import { asynchandler } from "../utils/asynchandle.js";
import { reshandler } from "../utils/reshandler.js";
import { Apierrorhandler } from "../utils/Apierrorhandler.js";
import { likes } from "../model/likes.model.js";
import { isValidObjectId } from "mongoose";

const commentlike = asynchandler(async (req, res) => {
  const { commentId } = req.params;

  if (!isValidObjectId(commentId)) {
    throw new Apierrorhandler("invalid commentId", 400);
  }

  const CommentLike = await likes.findOne(
    {
      $set: {
        comment: commentId,
        owner: req.user?._id,
      },
    },
    { new: true }
  );

  return res
    .status(200)
    .json(new reshandler(200, { CommentLike }, "comment liked by User"));
});

const tweetlike = asynchandler(async (req, res) => {
  const { tweetId } = req.params;

  if (!isValidObjectId(tweetId)) {
    throw new Apierrorhandler("invalid tweet", 400);
  }

  const Tweetlike = await likes.findOne(
    {
      $set: {
        tweet: tweetId,
        owner: req.user?._id,
      },
    },
    { new: true }
  );

  return res
    .status(200)
    .json(new reshandler(200, { Tweetlike }, "tweet liked by User"));
});

const videoslike = asynchandler(async (req, res) => {
  const { VideoId } = req.params;

  if (!isValidObjectId(VideoId)) {
    throw new Apierrorhandler("invalid VideoId", 400);
  }

  const Videolike = await likes.findOne(
    {
      $set: {
        video: VideoId,
        owner: req.user?._id,
      },
    },
    { new: true }
  );

  return res
    .status(200)
    .json(new reshandler(200, { Videolike }, "video liked by User"));
});

const likedvideos = asynchandler(async (req, res) => {
  const like = await likes
    .find({
      owner: req.user?._id,
      video: { $ne: null },
    })
    .populate("video");

  const likeVideos = like.map((likes) => likes.video);

  if (likeVideos.length === 0) {
    return res
      .status(200)
      .json(
        new reshandler(200, { likeVideos }, "you have not aly like videos yet")
      );
  }

  return res.status(200).json(
    new reshandler(
      200,
      {
        likeVideos,
      },
      "like Videos fetched successfully"
    )
  );
});

//NOT COMPLETED
const liketweets = asynchandler(async (req, res) => {
  const tweet = await likes
    .find({
      owner: req.user?._id,
      tweet: { $ne: null },
    })
    .populate("tweet");

    

});

const likecomments = asynchandler(async (req, res) => {});

export {
  commentlike,
  tweetlike,
  videoslike,
  likedvideos,
  liketweets,
  likecomments,
};
