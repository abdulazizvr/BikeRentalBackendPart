const sequelize = require("../config/db");
const { DataTypes } = require("sequelize");

const Otp = sequelize.define(
    "otp",{
        id:{
            type: DataTypes.UUID,
            primaryKey: true 
        },
        otp:{type:DataTypes.STRING,allowNull:false},
        expiration_time:{type:DataTypes.DATE,allowNull:false},
        verified:{type:DataTypes.BOOLEAN,defaultValue:false}
    },{
        freezeTableName:true
    }
)

module.exports = Otp