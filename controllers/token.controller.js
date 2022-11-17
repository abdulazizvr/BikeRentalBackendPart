const Token = require("../models/Token");

const ApiError = require("../error/ApiError");

const getTokens = async (ctx) => {
  try {
    const data = await Token.findAll();
    if (data.length < 1)
      return ctx.error(404, { message: "Information not found!" });
    ctx.ok(200, data);
  } catch (error) {
    ApiError.internal(ctx, {
      message: error,
      friendlyMsg: "Serverda hatolik",
    });
  }
};

const getToken = async (ctx) => {
  try {
    const id = ctx.params.id;
    const check = await Token.findOne({
      where: {
        id: id,
      },
    });
    if (!check) return ctx.error(404, { friendlyMsg: "Information not found" });
    ctx.ok(200, check);
  } catch (error) {
    ApiError.internal(ctx, {
      message: error,
      friendlyMsg: "Serverda hatolik",
    });
  }
};

const addToken = async (ctx) => {
  try {
    const { table_name, user_id, user_os, user_device, token } =
      ctx.request.body;
    const check = await Token.create({
      table_name,
      user_id,
      user_os,
      user_device,
      token,
    });
    if (!check)
      ctx.error(404, {
        message: "Error has been detected during save information",
      });
    ctx.ok(200, { message: "Added" });
  } catch (error) {
    ApiError.internal(ctx, {
      message: error,
      friendlyMsg: "Serverda hatolik",
    });
  }
};
const updateToken = async (ctx) => {
  try {
    const id = ctx.params.id;
    const { user_id, table_name, user_os, user_device, token } =
      ctx.request.body;
    if (!user_id && !table_name && !user_os && !user_device && !token)
      return ctx.error(404, {
        message: "You have to add even one element for update",
      });
    const check = await Token.findByPk(id);
    if (!check) return (ctx.body = "Id is Incorrect!");
    const updatetoken = await Token.update(
      {
        user_id: user_id || check.user_id,
        table_name: table_name || check.table_name,
        user_os: user_os || check.user_os,
        user_device: user_device || check.user_device,
        token: token || check.token,
      },
      {
        where: {
          id: id,
        },
      }
    );
    ctx.ok(200, { message: "Token updated" });
  } catch (error) {
    ApiError.internal(ctx, {
      message: error,
      friendlyMsg: "Serverda hatolik",
    });
  }
};
const deleteToken = async (ctx) => {
  try {
    const id = ctx.params.id;
    const client = await Token.destroy({
      where: {
        id: id,
      },
    });
    ctx.ok(200,{message:"Deleted!"})
  } catch (error) {
    ApiError.internal(ctx, {
      message: error,
      friendlyMsg: "Serverda hatolik",
    });
  }
};

module.exports = {
  getTokens,
  getToken,
  updateToken,
  addToken,
  deleteToken,
};
