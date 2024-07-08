class Apierrorhandler extends Error {

    constructor (
        message = "by API_Error_handler", 
        statuscode, 
        errors = [], 
        stack = ""
){
        super(message)
        this.statuscode = statuscode,
        this.errors = errors,
        this.success = false,
        this.data = null

        if(stack) {
            this.stack = stack
        }  else     {
            Error.captureStackTrace(this, this.constructor)
        }
    }
}




export {Apierrorhandler}