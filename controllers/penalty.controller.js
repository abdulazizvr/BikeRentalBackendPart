const Penalty = require("../models/Penalty");

const ApiError = require("../error/ApiError");

const getPenalties = async (ctx) => {
  try {
    const data = await Penalty.findAll();
    if (data.length < 1) return (ctx.body = "Information not found!");
    ctx.ok(200, data);
  } catch (error) {
    ApiError.internal(ctx, {
      message: error,
      friendlyMsg: "Serverda hatolik",
    });
  }
};

const getPenalty = async (ctx) => {
  try {
    const id = ctx.params.id;
    const data = await Penalty.findOne({
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

const addPenalty = async (ctx) => {
  try {
    const {
      rental_id,
      penalty_amount,
      payment_status,
      remarks,
      paid_by,
      user_id,
    } = ctx.request.body;
    const data = await Penalty.create({
      rental_id,
      penalty_amount,
      payment_status,
      remarks,
      paid_by,
      user_id,
    });
    if (!data)
      return ctx.error(404, { friendlyMsg: "Error detected during save" });
    ctx.ok(200, {
      message: `Penalty added as called ${data.remarks}`,
    });
  } catch (error) {
    ApiError.internal(ctx, {
      message: error,
      friendlyMsg: "Serverda hatolik",
    });
  }
};

const updatePenalty = async (ctx) => {
  try {
    const id = ctx.params.id;
    const {
      rental_id,
      penalty_amount,
      payment_status,
      paid_by,
      remarks,
      user_id,
    } = ctx.request.body;
    if (
      !rental_id &&
      !penalty_amount &&
      !payment_status &&
      !paid_by &&
      !remarks &&
      !user_id
    ) {
      ctx.error(408, {
        friendlyMsg: "You must send data even one to update your Information",
      });
    }
    const idData = await Penalty.findByPk(id);
    if (idData == null)
      return ctx.error(406, { friendlyMsg: "Id is incorrect" });
    const updatedRows = await Penalty.update(
      {
        rental_id: rental_id || idData.rental_id,
        penalty_amount: penalty_amount || idData.penalty_amount,
        payment_status: payment_status || idData.payment_status,
        paid_by: paid_by || idData.paid_by,
        remarks: remarks || idData.remarks,
        user_id: user_id || idData.user_id,
      },
      {
        where: { id: id },
      }
    );
    if (!updatedRows)
      return ctx.error(406, { friendlyMsg: "Error during save information!" });
    ctx.ok(200, {
      message: "Penalty information updated",
    });
  } catch (error) {
    ApiError.internal(ctx, {
      message: error,
      friendlyMsg: "Serverda hatolik",
    });
  }
};

const deletePenalty = async (ctx) => {
  try {
    const id = ctx.params.id;
    const check = await Penalty.destroy({
      where: {
        id: id,
      },
    });
    if (!check)
      return ctx.error(404, {
        friendlyMsg: "Information not found",
      });
    ctx.ok(200, { message: "Information updated" });
  } catch (error) {
    ApiError.internal(ctx, {
      message: error,
      friendlyMsg: "Serverda hatolik",
    });
  }
};

module.exports = {
  getPenalties,
  getPenalty,
  addPenalty,
  updatePenalty,
  deletePenalty,
};
