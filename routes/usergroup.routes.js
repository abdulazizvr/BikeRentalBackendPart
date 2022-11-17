const Router = require("@koa/router")
const { getUserGroups, addUserGroup, getUserGroup, updateUserGroup, deleteUserGroup } = require("../controllers/usergroup.controller")

const router = new Router()

const Validator = require("../middlewares/validator")

router.get("/",getUserGroups)
router.post("/",Validator("usergroup"),addUserGroup)
router.get("/:id",getUserGroup)
router.put("/:id",Validator("usergroup"),updateUserGroup)
router.delete("/:id",deleteUserGroup)

module.exports = () => router.routes()