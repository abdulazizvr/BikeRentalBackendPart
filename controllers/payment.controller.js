const Payment = require("../models/Payment");

const ApiError = require("../error/ApiError");

const getPayments = async (ctx) => {
  try {
    const data = await Payment.findAll();
    if (data.length < 1) return (ctx.body = "Information not found!");
    ctx.ok(200, data);
  } catch (error) {
    ApiError.internal(ctx, {
      message: error,
      friendlyMsg: "Serverda hatolik",
    });
  }
};

const getPayment = async (ctx) => {
  try {
    const id = ctx.params.id;
    const data = await Payment.findOne({
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

const addPayment = async (ctx) => {
  try {
    const { rental_id, payment_type, paid_by, payment_date, remarks, user_id } =
      ctx.request.body;
    const data = await Payment.create({
      rental_id,
      payment_type,
      paid_by,
      payment_date,
      remarks,
      user_id,
    });
    if (!data)
      return ctx.error(404, { friendlyMsg: "Error detected during save" });
    ctx.ok(200, { message: "infromation updated" });
  } catch (error) {
    ApiError.internal(ctx, {
      message: error,
      friendlyMsg: "Serverda hatolik",
    });
  }
};

const updatePayment = async (ctx) => {
  try {
    const id = ctx.params.id;
    const { rental_id, payment_type, paid_by, payment_date, remarks, user_id } =
      ctx.request.body;
    if (
      !rental_id &&
      !payment_type &&
      !paid_by &&
      !payment_date &&
      !remarks &&
      !user_id
    ) {
      ctx.error(408, {
        friendlyMsg: "You must send data even one to update your Information",
      });
    }
    const idData = await Payment.findByPk(id);
    if (idData == null)
      return ctx.error(406, { friendlyMsg: "Id is incorrect" });
    const updatedRows = await Payment.update(
      {
        rental_id: rental_id || idData.rental_id,
        payment_type: payment_type || idData.payment_type,
        paid_by: paid_by || idData.paid_by,
        payment_date: payment_date || idData.payment_date,
        remarks: remarks || idData.remarks,
        user_id: user_id || idData.user_id,
      },
      {
        where: { id: id },
      }
    );
    if (!updatedRows)
      return ctx.error(406, { friendlyMsg: "Error during save information!" });
    ctx.ok(200, { friendlyMsg: "Payment information updated" });
  } catch (error) {
    ApiError.internal(ctx, {
      message: error,
      friendlyMsg: "Serverda hatolik",
    });
  }
};

const deletePayment = async (ctx) => {
  try {
    const id = ctx.params.id;
    const check = await Payment.destroy({
      where: {
        id: id,
      },
    });
    if (!check)
      return ctx.error(404, { friendlyMsg: "Id bo'yicha ma'lumot topilmadi!" });
    ctx.ok(200, { message: "Payment information deleted" });
  } catch (error) {
    ApiError.internal(ctx, {
      message: error,
      friendlyMsg: "Serverda hatolik",
    });
  }
};

module.exports = {
  getPayment,
  getPayments,
  addPayment,
  updatePayment,
  deletePayment,
};
