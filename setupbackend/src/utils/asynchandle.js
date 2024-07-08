const asynchandler = (requesthandle) => async(req,res,next) => {
    try {
        await requesthandle(req,res,next)
    } catch (error) {
        res.status(error.code || 500).json({
            success: false,
            message: error.message
        })
    }
}

export {asynchandler}



/* same function by promise method

 const asynchandler = (functionrequest) => {
    return (req,res,next) => {
        promise.resolve(requesthandle(req,res,next).catch(error) => next(err)}
    }

*/