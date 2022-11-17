const Router = require("@koa/router")
const { getBikeinfos, getBikeinfo, addBikeinfo, deleteBikeInfo, updateBikeInfo } = require("../controllers/bikeinfo.controller")
const router = new Router()
const Validator = require("../middlewares/validator")

router.get("/",getBikeinfos)
router.get("/:id",Validator("bikeinfo"),getBikeinfo)
router.post("/",addBikeinfo)
router.put("/:id",Validator("bikeinfo"),updateBikeInfo)
router.delete("/:id",deleteBikeInfo)

module.exports = () => router.routes()