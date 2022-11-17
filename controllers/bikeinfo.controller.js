const bikeInfo = require("../models/BikeInfo");

const ApiError = require("../error/ApiError");

const getBikeinfos = async (ctx) => {
  try {
    const data = await bikeInfo.findAll();
    if (data.length < 2) return (ctx.body = "Information not found!");
    ctx.ok(200, data);
  } catch (error) {
    ApiError.internal(ctx, {
      message: error,
      friendlyMsg: "Serverda hatolik",
    });
  }
};

const getBikeinfo = async (ctx) => {
  try {
    const id = ctx.params.id;
    const data = await bikeInfo.findOne({
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

const addBikeinfo = async (ctx) => {
  try {
    const {
      bike_category_id,
      shop_id,
      bike_name,
      specs,
      rent_price,
      availability,
      user_id,
    } = ctx.request.body;
    const data = await bikeInfo.create({
      bike_category_id,
      shop_id,
      bike_name,
      specs,
      rent_price,
      availability,
      user_id,
    });
    if (!data)
      return ctx.error(404, { friendlyMsg: "Error detected during save" });
    ctx.ok(200, { friendlyMsg: `Info added as called ${data.bike_name}` });
  } catch (error) {
    ApiError.internal(ctx, {
      message: error,
      friendlyMsg: "Serverda hatolik",
    });
  }
};

const updateBikeInfo = async (ctx) => {
  try {
    const id = ctx.params.id;
    const {
      bike_category_id,
      shop_id,
      bike_name,
      specs,
      rent_price,
      availability,
      user_id,
    } = ctx.request.body;
    if (
      !bike_category_id &&
      !shop_id &&
      !bike_name &&
      !specs &&
      !rent_price &&
      !availability &&
      !user_id
    ) {
      ctx.error(408, {
        friendlyMsg: "You must send data even one to update your Information",
      });
    }
    const idData = await bikeInfo.findByPk(id);
    if (idData == null)
      return ctx.error(406, { friendlyMsg: "Id is incorrect" });
    const updatedRows = await bikeInfo.update(
      {
        bike_category_id: bike_category_id || idData.bike_category_id,
        shop_id: shop_id || idData.shop_id,
        bike_name: bike_name || idData.bike_name,
        specs: specs || idData.specs,
        rent_price: rent_price || idData.rent_price,
        availability: availability || idData.availability,
        user_id: user_id || idData.user_id,
      },
      {
        where: { id: id },
      }
    );
    if (!updatedRows)
      return ctx.error(406, { friendlyMsg: "Error during save information!" });
    ctx.ok(200, { friendlyMsg: "BikeInfo updated!" });
  } catch (error) {
    ApiError.internal(ctx, {
      message: error,
      friendlyMsg: "Serverda hatolik",
    });
  }
};

const deleteBikeInfo = async (ctx) => {
  try {
    const id = ctx.params.id;
    const check = await bikeInfo.destroy({
      where: {
        id: id,
      },
    });
    if (!check) ctx.error(401, { message: "Ma'lumotlar topilmadi" });
    ctx.ok(200, { friendlyMsg: "Bike information deleted" });
  } catch (error) {
    ApiError.internal(ctx, {
      message: error,
      friendlyMsg: "Serverda hatolik",
    });
  }
};

module.exports = {
  getBikeinfos,
  getBikeinfo,
  addBikeinfo,
  updateBikeInfo,
  deleteBikeInfo,
};
