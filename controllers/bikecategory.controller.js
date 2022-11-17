const bikeCategory = require("../models/BikeCategory");

const ApiError = require("../error/ApiError");

const getBikeCategories = async (ctx) => {
  try {
    const data = await bikeCategory.findAll();
    if (data.length < 2) return (ctx.body = "Information not found!");
    ctx.ok(200, data);
  } catch (error) {
    ApiError.internal(ctx, {
      message: error,
      friendlyMsg: "Serverda hatolik",
    });
  }
};

const getBikeCategory = async (ctx) => {
  try {
    const id = ctx.params.id;
    const data = await bikeCategory.findOne({
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

const addbikeCategory = async (ctx) => {
  try {
    const { category_name, description } = ctx.request.body;
    const data = await bikeCategory.create({ category_name, description });
    if (!data)
      return ctx.error(404, { friendlyMsg: "Error detected during save" });
    ctx.ok(200, { message: `Category added as called ${category_name}` });
  } catch (error) {
    ApiError.internal(ctx, {
      message: error,
      friendlyMsg: "Serverda hatolik",
    });
  }
};

const updatebikeCategory = async (ctx) => {
  try {
    const id = ctx.params.id;
    const { category_name, description } = ctx.request.body;
    if (!category_name && !description) {
      ctx.error(408, {
        friendlyMsg: "You must send data even one to update your Information",
      });
    }
    const idData = await bikeCategory.findByPk(id);
    if (idData == null)
      return ctx.error(406, { friendlyMsg: "Id is incorrect" });
    const updatedRows = await bikeCategory.update(
      {
        category_name: category_name || idData.category_name,
        description: description || idData.description,
      },
      {
        where: { id: id },
      }
    );
    if (!updatedRows)
      return ctx.error(406, { friendlyMsg: "Error during save information!" });
    ctx.ok(200, { friendlyMsg: "Info updated!" });
  } catch (error) {
    ApiError.internal(ctx, {
      message: error,
      friendlyMsg: "Serverda hatolik",
    });
  }
};

const deleteBikeCategory = async (ctx) => {
  try {
    const id = ctx.params.id;
    const check = await bikeCategory.destroy({
      where: {
        id: id,
      },
    });
    if (!check) ctx.error(401, { message: "Ma'lumotlar topilmadi" });
    ctx.ok(200, { message: "Info deleted" });
  } catch (error) {
    ApiError.internal(ctx, {
      message: error,
      friendlyMsg: "Serverda hatolik",
    });
  }
};

module.exports = {
  getBikeCategory,
  getBikeCategories,
  addbikeCategory,
  updatebikeCategory,
  deleteBikeCategory,
};
