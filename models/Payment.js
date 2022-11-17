const sequelize = require("../config/db");
const { DataTypes } = require("sequelize");

const Payment = sequelize.define(
  "payment",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      unique: true
    },
    rental_id: { type: DataTypes.INTEGER, allowNull: false },
    payment_type: { type: DataTypes.INTEGER,allowNull:false },
    paid_by: { type: DataTypes.STRING(30), allowNull: false },
    payment_date: { type: DataTypes.DATE, defaultValue: Date.now() },
    remarks: { type: DataTypes.STRING(100), allowNull: false },
    user_id: { type: DataTypes.INTEGER },
  },
  {
    freezeTableName: true,
  }
);

module.exports = Payment;
