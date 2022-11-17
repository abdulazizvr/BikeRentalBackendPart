const Router = require("@koa/router")
const { getPenalties, getPenalty, addPenalty, updatePenalty, deletePenalty } = require("../controllers/penalty.controller")
const router = new Router()

const Validator = require("../middlewares/validator")

router.get("/",getPenalties)
router.get("/:id",getPenalty)
router.post("/",Validator("penalty"),addPenalty)
router.put("/:id",Validator("penalty"),updatePenalty)
router.delete("/:id",deletePenalty)

module.exports = () => router.routes()