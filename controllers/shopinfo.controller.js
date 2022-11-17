const shopInfo = require("../models/ShopInfo");

const ApiError = require("../error/ApiError");

const getShopInfos = async (ctx) => {
  try {
    const data = await shopInfo.findAll();
    if (data.length < 2) return (ctx.body = "Information not found!");
    ctx.ok(200, data);
  } catch (error) {
    ApiError.internal(ctx, {
      message: error,
      friendlyMsg: "Serverda hatolik",
    });
  }
};

const getShopInfo = async (ctx) => {
  try {
    const id = ctx.params.id;
    const data = await shopInfo.findOne({
      where: {
        id: id,
      },
    });
    if (data == null)
      return ctx.error(400, { friendlyMsg: "Information not found" });
    ctx.ok(200, data);
  } catch (error) {
    ApiError.internal(ctx, {
      message: error,
      friendlyMsg: "Serverda hatolik",
    });
  }
};

const addShopInfo = async (ctx) => {
  try {
    const {
      shop_name,
      owner_name,
      address,
      email_adress,
      contact_no,
      website,
      updated_by,
    } = ctx.request.body;
    const data = await shopInfo.create({
      shop_name,
      owner_name,
      address,
      email_adress,
      contact_no,
      website,
      updated_by,
    });
    if (!data)
      return ctx.error(404, { friendlyMsg: "Error detected during save" });
    ctx.ok(200,{friendlyMsg:`Shop added as called ${data.shop_name}`})
  } catch (error) {
    ApiError.internal(ctx, {
      message: error,
      friendlyMsg: "Serverda hatolik",
    });
  }
};

const updateShopInfo = async (ctx) => {
  try {
    const id = ctx.params.id;
    const {
      shop_name,
      owner_name,
      address,
      email_adress,
      contact_no,
      website,
      updated_by,
    } = ctx.request.body;
    if (
      !shop_name &&
      !owner_name &&
      !address &&
      !email_adress &&
      !contact_no &&
      !website &&
      !updated_by
    ) {
      ctx.error(408, {
        friendlyMsg: "You must send data even one to update your Information",
      });
    }
    const idData = await shopInfo.findByPk(id);
    if (idData == null)
      return ctx.error(406, { friendlyMsg: "Id is incorrect" });
    const updatedRows = await shopInfo.update(
      {
        shop_name: shop_name || idData.shop_name,
        owner_name: owner_name || idData.owner_name,
        address: address || idData.address,
        email_adress: email_adress || idData.email_adress,
        contact_no: contact_no || idData.contact_no,
        website: website || idData.website,
        updated_by: updated_by || idData.updated_by,
      },
      {
        where: { id: id },
      }
    );
    if (!updatedRows)
      return ctx.error(406, { friendlyMsg: "Error during save information!" });

    ctx.ok(200,{message:"Information updated!"})
  } catch (error) {
    ApiError.internal(ctx, {
      message: error,
      friendlyMsg: "Serverda hatolik",
    });
  }
};

const deleteShopInfo = async (ctx) => {
  try {
    const id = ctx.params.id;
    const check = await shopInfo.destroy({
      where: {
        id: id,
      },
    });
    if (!check) ctx.error(401, { message: "Ma'lumotlar topilmadi" });
    ctx.ok(200,{message:"Shop information deleted"});
  } catch (error) {
    ApiError.internal(ctx, {
      message: error,
      friendlyMsg: "Serverda hatolik",
    });
  }
};
module.exports = {
  getShopInfo,
  getShopInfos,
  addShopInfo,
  updateShopInfo,
  deleteShopInfo,
};
