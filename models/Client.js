const sequelize = require("../config/db");
const { DataTypes } = require("sequelize");

const Client = sequelize.define(
  "client",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      unique: true
    },
    client_code: { type: DataTypes.STRING},
    avatar: { type: DataTypes.STRING(101),defaultValue:"Images/style/img/def.jpg" },
    client_name: { type: DataTypes.STRING(130), },
    email_address: { type: DataTypes.STRING, },
    contact_number: { type: DataTypes.STRING(155),},
    complete_address: { type: DataTypes.STRING(100) },
    username: { type: DataTypes.STRING(130),},
    password: { type: DataTypes.STRING(230),},
    status: { type: DataTypes.BOOLEAN, defaultValue: false },
    otp_id:{type:DataTypes.UUID}
  },
  {
    freezeTableName: true,
  }
);

module.exports = Client;