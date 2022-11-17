const Client = require("../models/Client");
const bcrypt = require("bcrypt");
const config = require("config");
const ApiError = require("../error/ApiError");
const jwt = require("../services/JwtService");
const Token = require("../models/Token");

const getClients = async (ctx) => {
  try {
    const data = await Client.findAll();
    console.log(data.length);
    if (data.length < 1)
      return ctx.error(404, { message: "Information not found" });
    ctx.ok(200, data);
  } catch (error) {
    ApiError.internal(ctx, {
      message: error,
      friendlyMsg: "Serverda hatolik",
    });
  }
};

const getClient = async (ctx) => {
  try {
    const id = ctx.params.id;
    const data = await Client.findOne({
      where: {
        id: id,
      },
    });
    if (data == null)
      return ctx.ok(400, { friendlyMsg: "Information not found" });
    ctx.ok(200, data);
  } catch (error) {
    ApiError.internal(ctx, {
      message: error,
      friendlyMsg: "Serverda hatolik",
    });
  }
};

const addClient = async (ctx) => {
  try {
    const {
      client_code,
      avatar,
      client_name,
      email_address,
      contact_number,
      complete_address,
      username,
      password,
      status,
    } = ctx.request.body;
    if (
      !client_code &&
      !avatar &&
      !client_name &&
      !email_address &&
      !contact_number &&
      !complete_address &&
      !username &&
      !password &&
      !status
    ) {
      ctx.error(408, {
        friendlyMsg: "You must send data even one to update your Information",
      });
    }
    const hashedPassword = bcrypt.hashSync(password, 7);
    const data = await Client.create({
      client_code,
      avatar,
      client_name,
      email_address,
      contact_number,
      complete_address,
      username,
      password: hashedPassword,
      status,
    });
    if (!data)
      return ctx.error(404, { friendlyMsg: "Error detected during save" });
    ctx.ok(200, { friendlyMsg: `Client added as called ${data.username} ` });
  } catch (error) {
    ApiError.internal(ctx, {
      message: error,
      friendlyMsg: "Serverda hatolik",
    });
  }
};

const updateClient = async (ctx) => {
  try {
    const id = ctx.params.id;
    if(decodedData.id != id){
      return ctx.error(404,{message:"You have to update especially you"})
    }
    const {
      client_code,
      avatar,
      client_name,
      email_address,
      contact_number,
      complete_address,
      username,
      password,
      status,
    } = ctx.request.body;
    if (
      !client_code &&
      !avatar &&
      !client_name &&
      !email_address &&
      !contact_number &&
      !complete_address &&
      !username &&
      !password &&
      !status
    ) {
      ctx.error(408, {
        friendlyMsg: "You must send data even one to update your Information",
      });
    }
    const idData = await Client.findByPk(id);
    if (idData == null)
      return ctx.error(406, { friendlyMsg: "Id is incorrect" });
    const hashedPassword = bcrypt.hashSync(password, 7);
    const updatedRows = await Client.update(
      {
        client_code: client_code || idData.client_code,
        avatar: avatar || idData.avatar,
        client_name: client_name || idData.client_name,
        email_address: email_address || idData.email_address,
        contact_number: contact_number || idData.contact_number,
        complete_address: complete_address || idData.complete_address,
        username: username || idData.username,
        password: hashedPassword || idData.password,
        status: status || idData.status,
      },
      {
        where: { id: id },
      }
    );
    if (!updatedRows)
      return ctx.error(406, { friendlyMsg: "Error during save information!" });
    ctx.ok(200, { message: "ClientInfo was updated!" });
  } catch (error) {
    ApiError.internal(ctx, {
      message: error,
      friendlyMsg: "Serverda hatolik",
    });
  }
};

const deleteClient = async (ctx) => {
  try {
    const id = ctx.params.id;
    if(decodedData.id != id){
      return ctx.error(400,{message:"You only delete you!"})
    }
    const check = await Client.destroy({
      where: {
        id: id,
      },
    });
    if (check == false) ctx.error(404, { message: "Information not found!" });
    ctx.ok(200, { friendlyMsg: "Client information deleted" });
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
    let client;
    if (!refreshToken)
      return ctx.error(400, { friendlyMsg: "Token is not found" });

    client = await Token.destroy({
      where: {
        token: refreshToken,
      },
    });
    console.log(client);
    if (!client) return ctx.error(400, { friendlyMsg: "Token topilmadi" });
    ctx.cookies.set("refreshToken", null);
    ctx.ok(200, `Ushbu insonning ma'lumotlari o'chirildi: ${client}`);
  } catch (error) {
    ApiError.internal(ctx, {
      message: error,
      friendlyMsg: "Serverda hatolik",
    });
  }
};

module.exports = {
  getClients,
  getClient,
  addClient,
  updateClient,
  deleteClient,
  logout
};
