const Router = require("@koa/router")
const { getClients, addClient, getClient, updateClient, deleteClient, logout} = require("../controllers/client.controller")
const router = new Router()

const Validator = require("../middlewares/validator")
const clientPolice = require("../middlewares/clientPolice")

router.get("/",getClients)
router.post("/",Validator("client"),addClient)
router.get("/:id",getClient)
router.put("/:id",Validator("client"),updateClient)
router.delete("/:id",clientPolice,deleteClient)
router.post("/logout",logout)
module.exports = () => router.routes()