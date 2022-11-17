const sequelize = require("../config/db")
const {DataTypes} = require("sequelize")


const AdsManagement = sequelize.define(
    "adsmanagement",
    {
        id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true,
            unique:true
        },
        ad_name:{type:DataTypes.STRING(30),unique:true},
        shop_id:{type: DataTypes.INTEGER},
        banner_image:{type:DataTypes.STRING(80), defaultValue:"image/banner/default.jpg"},
        description:{type: DataTypes.STRING},
        start_date:{type:DataTypes.DATE,defaultValue: Date.now()},
        end_date:{type: DataTypes.DATE,allowNull:false},
        ad_location:{type: DataTypes.BOOLEAN,defaultValue:false},
        amount:{type: DataTypes.DECIMAL,allowNull:false},
        user_id:{type:DataTypes.INTEGER}
    }
)

module.exports = AdsManagement