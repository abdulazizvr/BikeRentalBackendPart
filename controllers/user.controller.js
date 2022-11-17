const User = require("../models/User");
const Token = require("../models/Token");
const ApiError = require("../error/ApiError");
const bcrypt = require("bcrypt");
const jwt = require("../services/JwtService");
const config = require("config");

const getUsers = async (ctx) => {
  try {
    const data = await User.findAll();
    if (data.length < 2)
      return ctx.error(400, { message: "Information not found!" });
    ctx.ok(200, data);
  } catch (error) {
    ApiError.internal(ctx, {
      message: error,
      friendlyMsg: "Serverda hatolik",
    });
  }
};

const getUser = async (ctx) => {
  try {
    const id = ctx.params.id;
    const idData = await User.findByPk(id);
    if (idData == null)
      return ctx.error(404, { message: "Information not found!" });
    ctx.ok(200, idData);
  } catch (error) {
    ApiError.internal(ctx, {
      message: error,
      friendlyMsg: "Serverda hatolik",
    });
  }
};

const addUser = async (ctx) => {
  try {
    const {
      username,
      password,
      avatar,
      fullname,
      contact,
      email,
      user_category_id,
      status,
    } = ctx.request.body;
    const hashedPassword = bcrypt.hashSync(password, 7);
    const data = await User.create({
      username,
      password: hashedPassword,
      avatar,
      fullname,
      contact,
      email,
      user_category_id,
      status,
    });
    if (!data) return ctx.error(403, { message: "Error during save!" });
    ctx.ok(201, { message: `User added as called ${data.username}` });
  } catch (error) {
    ApiError.internal(ctx, {
      message: error,
      friendlyMsg: "Serverda hatolik",
    });
  }
};

const updateUser = async (ctx) => {
  try {
    const id = ctx.params.id;
    if(decodedData.id != id){
      return ctx.error(400,{
        friendlyMsg:"You only update you profile"
      })
    }
    const {
      username,
      password,
      avatar,
      fullname,
      contact,
      email,
      user_category_id,
      status,
    } = ctx.request.body;
    if (
      !username &&
      !password &&
      !avatar &&
      !fullname &&
      !contact &&
      !email &&
      !user_category_id &&
      !status
    ) {
      ctx.error(403, {
        message: "You must send date even to update your Information !",
      });
    }
    const idData = await User.findByPk(id);
    if (idData == null) return ctx.error(405, { message: "Data is null!" });
    let hashedPassword = bcrypt.hashSync(password, 7);
    const updatedRows = await User.update(
      {
        username: username || idData.username,
        password: hashedPassword || idData.password,
        avatar: avatar || idData.avatar,
        fullname: fullname || idData.fullname,
        contact: contact || idData.contact,
        email: email || idData.email,
        user_category_id: user_category_id || idData.user_category_id,
        status: status || idData.status,
      },
      {
        where: { id: id },
      }
    );
    if (!updatedRows) return ctx.error(404, { message: "Error during save!" });
    ctx.ok(200,{message:"Succesfully updated!"})
  } catch (error) {
    ApiError.internal(ctx, {
      message: error,
      friendlyMsg: "Serverda hatolik",
    });
  }
};

const deleteUser = async (ctx) => {
  try {
    const id = ctx.params.id;
    console.log(decodedData);
    if (decodedData.id != id) {
      return ctx.error(404, {
        friendlyMsg: "Id and token.id is different ! You cannot make delete!",
      });
    }
    const check = await User.destroy({
      where: {
        id: id,
      },
    });
    if (!check) return ctx.error(404, { friendlyMsg: "Id is incorrect" });
    ctx.ok(200, { message: "User deleted" });
  } catch (error) {
    ApiError.internal(ctx, {
      message: error,
      friendlyMsg: "Serverda hatolik",
    });
  }
};

const loginUser = async (ctx) => {
  try {
    let user;
    const { login, password } = ctx.request.body;
    console.log(login);
    // client = await select(
    //   "select * from admin where admin_phone_number = $1",
    //   login
    // );
    user = await User.findOne({
      where: {
        email: login,
      },
    });
    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword)
      return ctx.error(400, { friendlyMsg: "Email or Password incorrect" });
    // const userAgent = req.headers["user-agent"]
    // console.log(userAgent)
    // const result = detector.detect(userAgent)
    // console.log("result parse",result)
    let variable = "admin";
    const user_os = "windows";
    const user_device = "asus x541";
    const payload = {
      id: user.id,
      status: user.status,
      user_category_id: user.user_category_id,
    };
    const tokens = jwt.generateTokens(payload);
    // const check = await select(
    //   "INSERT INTO token (table_name,user_id,token,user_os,user_device) values($1,$2,$3,$4,$5) returning id",
    //   variable,
    //   admin.id,
    //   tokens.refreshToken,
    //   user_os,
    //   user_device
    // );
    const check = await Token.create({
      table_name: variable,
      user_id: user.id,
      token: tokens.refreshToken,
      user_os: user_os,
      user_device: user_device,
    });
    ctx.cookies.set("refreshToken", tokens.refreshToken, {
      maxAge: config.get("refresh_ms"),
      httpOnly: true,
    });
    ctx.ok(200, tokens);
  } catch (error) {
    ApiError.internal(ctx, {
      message: error,
      friendlyMsg: "Serverda hatolik",
    });
  }
};

const logout = async (ctx) => {
  try {
    const refreshToken = ctx.cookies.get("refreshToken");
    let user;
    if (!refreshToken)
      return ctx.error(400, { friendlyMsg: "Token is not found" });

    user = await Token.destroy({
      where: {
        token: refreshToken,
      },
    });
    console.log(user);
    if (!user) return ctx.error(400, { friendlyMsg: "Token topilmadi" });
    ctx.cookies.set("refreshToken", null);
    ctx.ok(200, `Ushbu insonning ma'lumotlari o'chirildi: ${user}`);
  } catch (error) {
    ApiError.internal(ctx, {
      message: error,
      friendlyMsg: "Serverda hatolik",
    });
  }
};

const refreshUserToken = async (ctx) => {
  try {
    const refreshToken = ctx.cookies.get("refreshToken");
    if (!refreshToken) {
      return ctx.error(404, { message: "Information was not found!" });
    }
    const decodedData = await jwt.verifyRefresh(refreshToken);
    console.log(decodedData);
    if (!decodedData) {
      return ctx.error(400, { message: "Jwt is incorrect!" });
    }
    const userDataDB = await User.findOne({
      where: {
        id: decodedData.id,
        user_category_id: decodedData.user_category_id,
        status: decodedData.status,
      },
    });
    const userDataCookie = await jwt.verifyRefresh(refreshToken);
    if (!userDataDB || !userDataCookie) {
      ctx.error(400, { friendlyMsg: "Ro'yxatdan o'tmagan!" });
    }
    const user = await User.findByPk(userDataCookie.id);
    if (!user) {
      ctx.error(400, { message: "Id incorrect" });
    }
    console.log("lolol");
    const payload = {
      id: user.id,
      user_category_id: user.user_category_id,
      user_status: user.status,
    };
    const tokens = jwt.generateTokens(payload);
    ctx.cookies.set("refreshToken", tokens.refreshToken, {
      maxAge: config.get("refresh_ms"),
      httpOnly: true,
    });
    ctx.ok(200, tokens);
  } catch (error) {
    ApiError.internal(ctx, {
      message: error,
      friendlyMsg: "Serverda hatolik",
    });
  }
};
module.exports = {
  getUser,
  getUsers,
  addUser,
  deleteUser,
  updateUser,
  loginUser,
  logout,
  refreshUserToken,
};
