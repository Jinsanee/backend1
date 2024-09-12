import { asynchandler } from "../utils/asynchandle.js";
import { Apierrorhandler } from "../utils/Apierrorhandler.js";
import { reshandler } from "../utils/reshandler.js";
import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../model/User.model.js";
import { Subcription } from "../model/Sub.model.js";

// for show you subscribe this or not
const toggleSubscription = asynchandler(async (req, res) => {
   const { channalId } = req.params;
   if (!channalId) {
      throw new Apierrorhandler("channalId not found", 404);
   }

   const subscriber = await Subcription.findOne({
      Subcriber: req.user._id,
      channal: channalId,
   });

   if (!subscriber) {
      const newsubscriber = await Subcription.create({
         Subcriber: req.user._id,
         channal: channalId,
      });

      if (!newsubscriber) {
         throw new Apierrorhandler(
            "subscriber not subscibe to the channal",
            500,
         );
      }
      return res
         .status(200)
         .json(
            new reshandler(
               200,
               { newsubscriber },
               "add new subsciber successfully",
            ),
         );
   }
   const deleteSubscriber = await Subcription.findByIdAndDelete(
      subscriber?._id,
   );
   if (!deleteSubscriber) {
      throw new Apierrorhandler(
         "somthing went wrong while deleteing the subscriber",
         403,
      );
   }
   return res
      .status(200)
      .json(
         new reshandler(
            200,
            { deleteSubscriber },
            "delete subscriber successfully",
         ),
      );
});

// for returning the list of subscriber who subscribe you
const subscriberList = asynchandler(async (req, res) => {
   const { channalId } = req.params;
   if (!channalId) {
      throw new Apierrorhandler("channal iD not found", 402);
   }
   const subscriberscount = await User.aggregate([
      {
         $match: {
            _id: new mongoose.Types.ObjectId(req.user?._id),
         },
      },
      {
         $lookup: {
            from: "subcriptions",
            localField: "_id",
            foreignField: "channal",
            as: "subscriberlist",
            pipeline: [
               {
                  from: "users",
                  localField: "Subcriber",
                  foreignField: "_id",
                  as: "subscriber",
                  pipeline: [
                     {
                        $project: {
                           username: 1,
                           fullname: 1,
                           email: 1,
                           avatar: 1,
                        },
                     },
                  ],
               },
               {
                  $addFields: {
                     subscriber: {
                        $first: "subscriber",
                     },
                  },
               },
               {
                  $lookup: {
                     from: "users",
                     localField: "channal",
                     foreignField: "_id",
                     as: "channal",
                  },
               },
            ],
         },
      },
      {
         $project: {
            subscriberList: 1,
         },
      },
   ]);

   return res
      .status(200)
      .json(
         new reshandler(
            200,
            { subscriberscount },
            "subsciberlist fetch successfully",
         ),
      );
});

// for returning the list of channal who you subscribe
const channalList = asynchandler(async (req, res) => {
   const { subscriberId } = req.params;

   const channallist = User.aggregate([
      {
         $match: {
            _id: new mongoose.Types.ObjectId(subscriberId),
         },
      },
      {
         $lookup: {
            from: "subcriptions",
            localField: "_id",
            foreignField: "Subcriber",
            as: "channalList",
            pipeline: [
               {
                  $lookup: {
                     from: "users",
                     localField: "channal",
                     foreignField: "_id",
                     as: "subscriber",
                     pipeline: [
                        {
                           $project: {
                              username: 1,
                              fullname: 1,
                              email: 1,
                              avatar: 1,
                           },
                        },
                     ],
                  },
               },
               {
                  $addFields: {
                     subscriber: {
                        $first: "subscriber",
                     },
                  },
               },{
                $lookup: {
                    from: "users",
                    localField: "channal",
                    foreignField: "_id",
                    as: "channal",
                    pipeline: [
                        {
                            $project: {
                                username: 1,
                                fullname: 1,
                                email: 1,
                                avatar: 1
                            }
                        }
                    ]
                }
               },{
                $addFields: {
                    channal: {
                        $first: "channal"
                    }
                }
               }
            ],
         },
      },
   ]);

   return res.status(200)
   .json(new reshandler(200,{channallist},"fetch channal data successfully"))
});

export { 
    toggleSubscription, 
    subscriberList, 
    channalList
 };
