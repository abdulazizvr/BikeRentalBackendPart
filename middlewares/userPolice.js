const jwt = require("../services/JwtService");
const config = require("config");
const to = require("../helpers/functionHandler");

const userPolice = async (ctx, next) => {
  if (ctx.request.method === "OPTIONS") {
    return next();
  }
  try {
    const authorization = ctx.headers.authorization;
    if (!authorization) {
      return ctx.error(403,{ message: "User ro'yxatdan o'tmagan" });
    }
    const token = authorization.split(" ")[1];
    if (!token) {
      return res.error(403,{ message: "User ro'yxatdan o'tmagan" });
    }
    [err, decodedData] = await to(
      jwt.verifyAccess(token, config.get("access_key"), {})
    );
    if (err) {
      console.log(err.message);
      return ctx.error(400, { friendlyMsg: err.message });
    }
    ctx.request.author = decodedData;
    if (decodedData.status === undefined) {
      return ctx.ok(403,{ message: "Error : JWT User tegishli emas!" });
    }
    return next();
  } catch (error) {
    console.log(error);
    return ctx.error(402,{ message: "User ro'yxatdan o'tmagan" });
  }
};

module.exports = userPolice
