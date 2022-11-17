const Router = require("@koa/router")
const { getTokens, addToken, getToken, updateToken, deleteToken } = require("../controllers/token.controller")

const router = new Router()

const Validator = require("../middlewares/validator")

router.get("/",getTokens)
router.post("/",Validator("token"),addToken)
router.get("/:id",getToken)
router.put("/:id",Validator("token"),updateToken)
router.delete("/:id",deleteToken)

module.exports = () => router.routes()