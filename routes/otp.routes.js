const Router = require("@koa/router")
const { getOtpies, addOtp, getOTPByID, updateOtp, deleteOtp, newOTP, verifyOTP, deleteOTP } = require("../controllers/otp.controller")

const router = new Router()

router.get("/",getOtpies)
// router.post("/",addOtp)
router.get("/:id",getOTPByID)
// router.put("/:id",updateOtp)

router.post("/newotp",newOTP)
router.post("/verify",verifyOTP)
router.delete("/deleteotp",deleteOTP)

module.exports = () => router.routes()