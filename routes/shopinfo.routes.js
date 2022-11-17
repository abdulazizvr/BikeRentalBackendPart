const Router = require("@koa/router")
const { getShopInfos, getShopInfo, addShopInfo, updateShopInfo, deleteShopInfo } = require("../controllers/shopinfo.controller")

const router = new Router()

const Validator = require("../middlewares/validator")

router.get("/",getShopInfos)
router.get("/:id",Validator("shopinfo"),getShopInfo)
router.post("/",addShopInfo)
router.put("/:id",Validator("shopinfo"),updateShopInfo)
router.delete("/:id",deleteShopInfo)

module.exports = () => router.routes()