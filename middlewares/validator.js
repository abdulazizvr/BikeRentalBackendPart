const Validators = require("../validations/index")

module.exports = function(validator) {
    if(!Validators.hasOwnProperty(validator))
        throw new Error (`'${validator}' validator is not exist`)

    return async function(ctx,next) {
        try {
            const validated = await Validators[validator].validateAsync(ctx.request.body)
            ctx.request.body = validated
            return next()
        } catch (err) {
            if(err.isJoi){
                // return res.error(400,{
                //     message:err.message,
                //     friendlyMsg:"Validation error"
                // })
                console.log(err.message)
                return ctx.body = err.message
            }
            return ctx.body = "Internal error"
            // return res.error(500,{
            //     friendlyMsg:"Internal Error"
            // })
            return next()
        }
    }
}