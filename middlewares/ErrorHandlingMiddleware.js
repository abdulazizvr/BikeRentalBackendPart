const ApiError = require("../error/ApiError");

module.exports = function (err, ctx, next) {
  console.log(err.message);
  if (err instanceof ApiError) {
    return ctx.status(err.status).json({ message: err.message });
  }
  if (err.message.includes("Unexpected token")) {
    return ctx.status(err.status).json({ message: err.message });
  }
  return ctx.status(500).send({ message: "Nazarda tutilmagan xatolik!" });
};