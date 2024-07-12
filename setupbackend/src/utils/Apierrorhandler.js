class Apierrorhandler extends Error {

    constructor (
        message = "by API_Error_handler",  // input values that taken by APiErrorhandler function
        statuscode, 
        errors = [], 
        stack = ""
){                                      // save values in the in the object
        super(message)                  // reviewed >>> (super) keyword
        this.statuscode = statuscode,   // these all are properties of Error
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