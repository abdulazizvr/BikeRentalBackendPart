const Router = require("@koa/router")
const { getRentals, getRental, addRental, updateRental, deleteRental } = require("../controllers/rental.controller")

const router = new Router()

const Validator = require("../middlewares/validator")

router.get("/",getRentals)
router.get("/:id",getRental)
router.post("/",Validator("rental"),addRental)
router.put("/:id",Validator("rental"),updateRental)
router.delete("/:id",deleteRental)

module.exports = () => router.routes()