const Router = require("@koa/router")
const { getUsers, getUser, addUser, updateUser, deleteUser, loginUser, logout, refreshUserToken } = require("../controllers/user.controller")

const router = new Router()

const Validator = require("../middlewares/validator")
const userPolice = require("../middlewares/userPolice")

router.get("/",userPolice,getUsers)
router.get("/:id",userPolice,getUser)
router.post("/",Validator("user"),addUser)
router.post("/refreshtoken/",refreshUserToken)
router.put("/:id",userPolice,Validator("user"),updateUser)
router.delete("/:id",userPolice,deleteUser)
router.post("/login",loginUser)
router.post("/logout",logout)

module.exports = () => router.routes()