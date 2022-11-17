const Rental = require("../models/Rental");

const ApiError = require("../error/ApiError");

const getRentals = async (ctx) => {
  try {
    const data = await Rental.findAll();
    if (data.length < 1) return (ctx.body = "Information not found!");
    ctx.ok(200, data);
  } catch (error) {
    ApiError.internal(ctx, {
      message: error,
      friendlyMsg: "Serverda hatolik",
    });
  }
};

const getRental = async (ctx) => {
  try {
    const id = ctx.params.id;
    const data = await Rental.findOne({
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

const addRental = async (ctx) => {
  try {
    const {
      bike_id,
      client_id,
      rental_start_date,
      rental_end_date,
      total_amount,
      payment_status,
      rental_status,
      remarks,
      user_id,
    } = ctx.request.body;
    const data = await Rental.create({
      bike_id,
      client_id,
      rental_start_date,
      rental_end_date,
      total_amount,
      payment_status,
      rental_status,
      remarks,
      user_id,
    });
    if (!data)
      return ctx.error(404, { friendlyMsg: "Error detected during save" });
    ctx.ok(200,{message:"Succesfully added"})
  } catch (error) {
    ApiError.internal(ctx, {
      message: error,
      friendlyMsg: "Serverda hatolik",
    });
  }
};

const updateRental = async (ctx) => {
  try {
    const id = ctx.params.id;
    const {
      bike_id,
      client_id,
      rental_start_date,
      rental_end_date,
      total_amount,
      payment_status,
      rental_status,
      remarks,
      user_id,
    } = ctx.request.body;
    if (
      !bike_id &&
      !client_id &&
      !rental_start_date &&
      !rental_end_date &&
      !total_amount &&
      !payment_status &&
      !rental_status &&
      !remarks &&
      !user_id
    ) {
      ctx.error(408, {
        friendlyMsg: "You must send data even one to update your Information",
      });
    }
    const idData = await Rental.findByPk(id);
    if (idData == null)
      return ctx.error(406, { friendlyMsg: "Id is incorrect" });
    const updatedRows = await Rental.update(
      {
        bike_id: bike_id || idData.bike_id,
        client_id: client_id || idData.client_id,
        rental_start_date: rental_start_date || idData.rental_start_date,
        rental_end_date: rental_end_date || idData.rental_end_date,
        total_amount: total_amount || idData.total_amount,
        payment_status: payment_status || idData.payment_status,
        rental_status: rental_status || idData.rental_status,
        remarks: remarks || idData.remarks,
        user_id: user_id || idData.user_id,
      },
      {
        where: { id: id },
      }
    );
    if (!updatedRows)
      return ctx.error(406, { friendlyMsg: "Error during save information!" });
    ctx.ok(200,{friendlyMsg:"Succesfully!"})
  } catch (error) {
    ApiError.internal(ctx, {
      message: error,
      friendlyMsg: "Serverda hatolik",
    });
  }
};

const deleteRental = async (ctx) => {
  try {
    const id = ctx.params.id;
    const check = await Rental.destroy({
      where: {
        id: id,
      },
    });
    if (!check) return  ctx.ok(200,{message:"Information not found!"})
    ctx.ok(200,{friendlyMsg:"Succesfully created!"})
  } catch (error) {
    ApiError.internal(ctx, {
      message: error,
      friendlyMsg: "Serverda hatolik",
    });
  }
};
module.exports = {
  getRentals,
  getRental,
  addRental,
  deleteRental,
  updateRental,
};
