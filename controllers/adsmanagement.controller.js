const AdsManagement = require("../models/Adsmanagement");

const ApiError = require("../error/ApiError");

const getAds = async (ctx) => {
  try {
    const data = await AdsManagement.findAll();
    if (data.length < 2)
      return ctx.error(404, {
        message: "Information not found!",
      });
    ctx.ok(200, data);
  } catch (error) {
    ApiError.internal(ctx, {
      message: error,
      friendlyMsg: "Serverda hatolik",
    });
  }
};

const getAd = async (ctx) => {
  try {
    const id = ctx.params.id;
    const data = await AdsManagement.findOne({
      where: {
        id: id,
      },
    });
    if (data == null)
      return ctx.error(404, { friendlyMsg: "Information not found" });
    ctx.ok(200, data);
  } catch (error) {
    ApiError.internal(ctx, {
      message: error,
      friendlyMsg: "Serverda hatolik",
    });
  }
};

const addAds = async (ctx) => {
  try {
    const {
      ad_name,
      shop_id,
      banner_image,
      description,
      start_date,
      end_date,
      ad_location,
      amount,
      user_id,
    } = ctx.request.body;
    const data = await AdsManagement.create({
      ad_name,
      shop_id,
      banner_image,
      description,
      start_date,
      end_date,
      ad_location,
      amount,
      user_id,
    });
    if (!data)
      return ctx.error(404, { friendlyMsg: "Error detected during save" });
    ctx.ok(201, { message: `Ads added as called ${data.ad_name}` });
  } catch (error) {
    ApiError.internal(ctx, {
      message: error,
      friendlyMsg: "Serverda hatolik",
    });
  }
};

const updateAds = async (ctx) => {
  try {
    const id = ctx.params.id;
    const {
      ad_name,
      shop_id,
      banner_image,
      description,
      start_date,
      end_date,
      ad_location,
      amount,
      user_id,
    } = ctx.request.body;
    if (
      !ad_name &&
      !shop_id &&
      !banner_image &&
      !description &&
      !start_date &&
      !end_date &&
      !ad_location &&
      !amount &&
      !user_id
    ) {
      ctx.error(408, {
        friendlyMsg: "You must send data even one to update your Information",
      });
    }
    const idData = await AdsManagement.findByPk(id);
    if (idData == null)
      return ctx.error(406, { friendlyMsg: "Id is incorrect" });
    const updatedRows = await AdsManagement.update(
      {
        ad_name: ad_name || idData.ad_name,
        shop_id: shop_id || idData.shop_id,
        banner_image: banner_image || idData.banner_image,
        description: description || idData.description,
        start_date: start_date || idData.start_date,
        end_date: end_date || idData.end_date,
        ad_location: ad_location || idData.ad_location,
        amount: amount || idData.amount,
        user_id: user_id || idData.user_id,
      },
      {
        where: { id: id },
      }
    );
    if (!updatedRows)
      return ctx.error(406, { friendlyMsg: "Error during save information!" });
    ctx.ok(200, { message: "Ads information updated" });
  } catch (error) {
    ApiError.internal(ctx, {
      message: error,
      friendlyMsg: "Serverda hatolik",
    });
  }
};

const deleteAds = async (ctx) => {
  try {
    const id = ctx.params.id;
    const check = await AdsManagement.destroy({
      where: {
        id: id,
      },
    });
    if (!check) return (ctx.status = 404);
    ctx.ok(204,{message:"Ads information deleted"})
  } catch (error) {
    ApiError.internal(ctx, {
      message: error,
      friendlyMsg: "Serverda hatolik",
    });
  }
};
module.exports = {
  getAd,
  getAds,
  addAds,
  deleteAds,
  updateAds,
};
