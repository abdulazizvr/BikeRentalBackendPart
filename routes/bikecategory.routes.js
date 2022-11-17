const Router = require("@koa/router")
const { getBikeCategories, addbikeCategory, getBikeCategory, updatebikeCategory, deleteBikeCategory } = require("../controllers/bikecategory.controller")

const router = new Router()
const Validator = require("../middlewares/validator")

router.get("/",getBikeCategories)
router.post("/",Validator("bikecategory"),addbikeCategory)
router.get("/:id",getBikeCategory)
router.put("/:id",Validator("bikecategory"),updatebikeCategory)
router.delete("/:id",deleteBikeCategory)

module.exports = () => router.routes()