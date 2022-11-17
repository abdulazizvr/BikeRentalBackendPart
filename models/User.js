const sequelize = require("../config/db")
const {DataTypes} = require("sequelize")

const User = sequelize.define(
    "user",
    {
        id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true,
            unique:true
        },
        username:{type: DataTypes.STRING,unique:true},
        password: {type: DataTypes.STRING},
        avatar:{type: DataTypes.STRING,defaultValue:"img/default.jpg"},
        fullname:{type: DataTypes.STRING(50)},
        contact: {type: DataTypes.STRING(15)},
        email: {type: DataTypes.STRING(30)},
        user_category_id: {type: DataTypes.INTEGER},
        status:{type:DataTypes.BOOLEAN,defaultValue:false}
    }
)

module.exports  =  User