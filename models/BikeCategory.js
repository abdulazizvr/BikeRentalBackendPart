const sequelize = require("../config/db");
const { DataTypes } = require("sequelize");

const BikeCategory = sequelize.define(
  "bikecategory",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      unique: true
    },
    category_name: { type: DataTypes.STRING(30), allowNull: false },
    description: { type: DataTypes.STRING(100), allowNull: false },
  },
  {
    freezeTableName: true,
    timestamps:false
  }
);

module.exports = BikeCategory;
