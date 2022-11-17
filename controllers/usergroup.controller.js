const userGroup = require("../models/Usergroup");

const ApiError = require("../error/ApiError");

const getUserGroups = async (ctx) => {
  try {
    const data = await userGroup.findAll();
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

const getUserGroup = async (ctx) => {
  try {
    const id = ctx.params.id;
    const idData = await userGroup.findByPk(id);
    if (idData == null)
      return ctx.error(400, { message: "Information not found!" });
    ctx.ok(200, idData);
  } catch (error) {
    ApiError.internal(ctx, {
      message: error,
      friendlyMsg: "Serverda hatolik",
    });
  }
};

const addUserGroup = async (ctx) => {
  try {
    const {
      group_name,
      description,
      allow_add,
      allow_edit,
      allow_delete,
      allow_print,
      allow_import,
      allow_export,
    } = ctx.request.body;
    const data = await userGroup.create({
      group_name,
      description,
      allow_add,
      allow_edit,
      allow_delete,
      allow_print,
      allow_import,
      allow_export,
    });
    if (!data)
      return (ctx.body = "error has been detected during save Information!");
    ctx.ok(201, { friendlyMsg: "Information added succesfully !" });
  } catch (error) {
    ApiError.internal(ctx, {
      message: error,
      friendlyMsg: "Serverda hatolik",
    });
  }
};

const updateUserGroup = async (ctx) => {
  try {
    const id = ctx.params.id;
    const {
      group_name,
      description,
      allow_add,
      allow_edit,
      allow_delete,
      allow_print,
      allow_import,
      allow_export,
    } = ctx.request.body;
    if (
      !group_name &&
      !description &&
      !allow_add &&
      !allow_edit &&
      !allow_delete &&
      !allow_print &&
      !allow_import &&
      !allow_export
    ) {
      ctx.error(408, {
        message: "You must send data even one to update your Information!",
      });
    }
    const idData = await userGroup.findByPk(id);
    if (idData == null) return (ctx.body = "Id is incorrect");
    const updatedRows = await userGroup.update(
      {
        group_name: group_name || idData.group_name,
        description: description || idData.description,
        allow_add: allow_add || idData.allow_add,
        allow_edit: allow_edit || idData.allow_edit,
        allow_delete: allow_delete || idData.allow_delete,
        allow_print: allow_print || idData.allow_print,
        allow_import: allow_import || idData.allow_import,
        allow_export: allow_export || idData.allow_export,
      },
      {
        where: { id: id },
      }
    );
    if (!updatedRows) return ctx.error(404,{message:"Error during save information!"})
    ctx.ok(200,{friendlyMsg:"Succesfully updated"})
  } catch (error) {
    ApiError.internal(ctx, {
      message: error,
      friendlyMsg: "Serverda hatolik",
    });
  }
};

const deleteUserGroup = async (ctx) => {
  try {
    const id = ctx.params.id;
    const check = await userGroup.destroy({
      where: {
        id: id,
      },
    });
    if (!check) return ctx.error(404,{message:"Id is incorrect"})
    ctx.ok(200,{friendlyMsg:"Succesfully deleted"})
  } catch (error) {
    ApiError.internal(ctx, {
      message: error,
      friendlyMsg: "Serverda hatolik",
    });
  }
};

module.exports = {
  getUserGroup,
  getUserGroups,
  updateUserGroup,
  deleteUserGroup,
  addUserGroup,
};
