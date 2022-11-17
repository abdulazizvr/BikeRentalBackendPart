const Router = require("@koa/router")
const { getAds, addAds, getAd, updateAds, deleteAds } = require("../controllers/adsmanagement.controller")
const router = new Router()
const Validator = require("../middlewares/validator")

router.get("/",getAds)
router.post("/",Validator("adsmanagement"),addAds)
router.get("/:id",getAd)
router.put("/:id",Validator("adsmanagement"),updateAds)
router.delete("/:id",deleteAds)

module.exports = () => router.routes()