import { asynchandler } from "../utils/asynchandle.js";
import { Apierrorhandler } from "../utils/Apierrorhandler.js";
import { reshandler } from "../utils/reshandler.js";
import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../model/User.model.js";
import {Subcription} from "../model/Sub.model.js"


// for show you subscribe this or not
const toggleSubscription = asynchandler(async(req,res) => {
const {channalId} = req.params
if(!channalId) {
    throw new Apierrorhandler("channalId not found",404)
}

const subscriber = await Subcription.findOne({
        Subcriber: req.user._id,
        channal: channalId
    })

    if(!subscriber) {
        const newsubscriber = await Subcription.create( {
            Subcriber: req.user._id,
            channal: channalId
        })
        
            if(!newsubscriber) {
                throw new Apierrorhandler("subscriber not subscibe to the channal", 500)
            }
            return res.status(200).json( new reshandler(200,{newsubscriber}, "add new subsciber successfully"))
    }
    const deleteSubscriber = await Subcription.findByIdAndDelete(subscriber?._id)
    if(!deleteSubscriber) {
        throw new Apierrorhandler("somthing went wrong while deleteing the subscriber",403)
    }
    return res.status(200)
    .json(new reshandler(200,{deleteSubscriber}, "delete subscriber successfully"))
})


// for returning the list of subscriber how subscribe you 
const subscriberList = asynchandler(async(req,res) => {

})


// for returning the list of channal how you subscribe
const channalList = asynchandler(async(req,res) => {

})

export {
    toggleSubscription,
    subscriberList,
    channalList
}