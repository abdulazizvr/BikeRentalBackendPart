const sequelize = require("../config/db")
const {DataTypes} = require("sequelize")


const Shopinfo = sequelize.define(
    "shopinfo",
    {
        id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true,
            unique:true
        },
        shop_name:{type:DataTypes.STRING,unique:true},
        owner_name:{type:DataTypes.STRING},
        address:{type:DataTypes.STRING(1000)},
        email_address:{type:DataTypes.STRING},
        contact_no:{type: DataTypes.STRING(15)},
        website:{type:DataTypes.STRING},
        updated_by: {type: DataTypes.INTEGER},
    },{
        freezeTableName:true
    }
)
// User.hasMany(ShopInfo,{
//     foreignKey:{
//         name:"updated_by"
//     }
// })
module.exports = Shopinfo