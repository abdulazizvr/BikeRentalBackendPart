const Router = require("@koa/router")
const { getPayments, addPayment, getPayment, updatePayment, deletePayment } = require("../controllers/payment.controller")

const router = new Router()
const Validator = require("../middlewares/validator")

router.get("/",getPayments)
router.post("/",Validator("payment"),addPayment)
router.get("/:id",getPayment)
router.put("/:id",Validator("payment"),updatePayment)
router.delete("/:id",deletePayment)

module.exports = () => router.routes()