const adsmanagement = require("./adsmanagement.validator")
const bikecategory = require("./bikecategory.validator")
const bikeinfo = require("./bikeinfo.validator")
const client = require("./client.validator")
const payment = require("./client.validator")
const otp = require("./otp.validator")
const penalty = require("./penalty.validator")
const rental = require("./rental.validator")
const shopinfo = require("./shopinfo.validator")
const token = require("./token.validator")
const user = require("./user.validator")
const usergroup = require("./usergroup.validator")

module.exports = {
    adsmanagement,
    bikecategory,
    bikeinfo,
    client,
    payment,
    otp,
    penalty,
    rental,
    shopinfo,
    token,
    user,
    usergroup
}