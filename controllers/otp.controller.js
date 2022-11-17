const Otp = require("../models/Otp");
const Token = require("../models/Token");
const { encode, decode } = require("../services/crypt");
const uuid = require("uuid");
const otpGenerator = require("otp-generator");
const pool = require("../config/db");
const jwt = require("../services/JwtService");
const config = require("config");
const Client = require("../models/Client");
function AddMinutesToDate(date, minutes) {
  return new Date(date.getTime() + minutes * 60000);
}

const dates = {
  convert: function (d) {
    return d.constructor === Date
      ? d
      : d.constructor === Array
      ? new Date(d[0], d[1], d[2])
      : d.constructor === Number
      ? new Date(d)
      : d.constructor === String
      ? new Date(d)
      : typeof d === "object"
      ? new Date(d.year, d.month, d.date)
      : NaN;
  },
  compare: function (a, b) {
    return isFinite((a = this.convert(a).valueOf())) &&
      isFinite((b = this.convert(b).valueOf()))
      ? (a > b) - (a < b)
      : NaN;
  },
  inRange: function (d, start, end) {
    return isFinite((d = this.convert(d).valueOf())) &&
      isFinite((start = this.convert(start).valueOf())) &&
      isFinite((end = this.convert(end).valueOf()))
      ? start <= d && d <= end
      : NaN;
  },
};

const getOtpies = async (ctx) => {
  try {
    const data = await Otp.findAll();
    if (!data) return (ctx.body = "Data is not found!");
    ctx.body = data;
  } catch (error) {
    ApiError.internal(ctx, {
      message: error,
      friendlyMsg: "Serverda hatolik",
    });
  }
};
const getOtp = async (ctx) => {
  try {
    const id = ctx.params.id;
    const idData = await Otp.findByPk(id);
    if (!idData) ctx.body = "Information not found";
  } catch (error) {
    ApiError.internal(ctx, {
      message: error,
      friendlyMsg: "Serverda hatolik",
    });
  }
};

// const addOtp = async (ctx) => {
//   try {
//     const { otp, expiration_time } = ctx.request.body;
//     const check = await Otp.add
//     if (!check)
//       return res.status(404).send("Error has been detected during save Otp !");
//     res.status(200).send({ message: "Otp added ! Because of you!" });
//   } catch (error) {
//     ApiError.internal(res, {
//       message: error,
//       friendlyMsg: "Serverda hatolik",
//     });
//   }
// };

// const updateOtp = async (ctx) => {
//   try {
//     const id = ctx.params.id;
//     const { otp, expiration_time } = ctx.request.body;
//     if (!otp && !expiration_time)
//       return res.status(402).send("You must add data for update");
//     const check = await select("select * from otp where id = $1", id);
//     if (!check)
//       return res.status(404).send({ message: "Not found information = " + id });
//     const updateclient = await select(
//       "update otp set otp = $2,expiration_time = $3 where id = $1",
//       id,
//       otp || check.otp,
//       expiration_time || check.expiration_time
//     );
//     res.status(200).send({ message: "Otp updated !" });
//   } catch (error) {
//     ApiError.internal(res, {
//       message: error,
//       friendlyMsg: "Serverda hatolik",
//     });
//   }
// };

const deleteOtp = async (ctx) => {
  try {
    const id = ctx.params.id;
    const check = await Otp.findByPk(id);
    ctx.ok(200, check);
  } catch (error) {}
};

const newOTP = async (ctx) => {
  try {
    const { phone_number } = ctx.request.body;
    const otp = otpGenerator.generate(4, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    const now = new Date();
    const expiration_time = AddMinutesToDate(now, 3);
    const id = uuid.v4();
    const newOtp = await Otp.create({ id, otp, expiration_time });
    const details = {
      timestamp: now,
      check: phone_number,
      succes: true,
      message: "OTP sent to user",
      otp_id: newOtp.id,
    };
    const encoded = await encode(JSON.stringify(details));
    ctx.body = {
      Status: "Succes",
      Details: encoded,
    };
  } catch (error) {
    console.log(error.message);
  }
};

const verifyOTP = async (ctx) => {
  try {
    const { verification_key, otp, check } = ctx.request.body;
    let currentdate = new Date();
    let decoded;
    try {
      decoded = await decode(verification_key);
    } catch (error) {
      const response = { Status: "Failure", Details: "Bad request" };
      ctx.body = response;
    }
    let obj = JSON.parse(decoded);
    const check_obj = obj.check;
    if (check_obj != check) {
      const response = {
        Status: "Failure",
        Details: "OTP was not sent to this particular phone number",
      };
      ctx.body = response;
    }
    let params = {
      id: obj.otp_id,
    };
    const otpResult = await Otp.findByPk(params.id);
    const result = otpResult;
    if (result != null) {
      if (result.verified != true) {
        if (dates.compare(result.expiration_time, currentdate) == 1) {
          if (otp === result.otp) {
            let params_verified = {
              id: result.id,
              verified: true,
            };

            await Otp.update(
              {
                verified: params_verified.verified,
              },
              {
                where: {
                  id: params_verified.id,
                },
              }
            );
            // const clientResult = await select(
            //   "select * from client where client_phone_number=$1",
            //   check
            // );
            const clientResult = await Client.findOne({
              where: {
                contact_number: check,
              },
            });
            console.log(clientResult);
            if (!clientResult) {
              const ln = await Client.create({ check });
              const payload = {
                id: ln.id,
              };
              const tokens = jwt.generateTokens(payload);
              const response = {
                Status: "Succes",
                id: ln.id,
                Details: "new",
                Token: tokens.accesToken,
              };
              await Token.create({table_name:"Client",user_id:ln.id,user_device:"Hardcode",token: tokens.refreshToken})
              ctx.cookies.set("refreshToken", tokens.refreshToken, {
                maxAge: config.get("refresh_ms"),
                httpOnly: true,
              });
              return (ctx.body = response);
            } else {
              const bn = await Client.findOne({
                where: { contact_number: check },
              });
              bn.otp_id = result.id;
              await bn.save();
              const payload = {
                id: bn.id,
                phone_number: bn.contact_number,
                status: bn.status,
              };
              const tokens = jwt.generateTokens(payload);
              const response = {
                Status: "Succes",
                Details: "old",
                Check: check,
                ClientName: clientResult.client_first_name,
                token: tokens.accesToken,
              };
              await Token.create({table_name:"Client",user_id:bn.id,user_device:"Hardcode",token: tokens.refreshToken})
              ctx.cookies.set("refreshToken", tokens.refreshToken, {
                maxAge: config.get("refresh_ms"),
                httpOnly: true,
              });
              return (ctx.body = response);
              //   return res.status(200).send(response);
            }
          } else {
            const response = { Status: "Failure", Details: "OTP NOT matched" };
            // return res.status(400).send(response);
            return (ctx.body = response);
          }
        } else {
          const response = { Status: "Failure", Details: "OTP Expired" };
          //   return res.status(400).send(response);
          return (ctx.body = response);
        }
      } else {
        const response = { Status: "Failure", Details: "OTP already used" };
        // return res.status(400).send(response);
        ctx.body = response;
      }
    } else {
      const response = { Status: "Failure", Details: "Bad Request" };
      //   return res.status(400).send(response);
      return (ctx.body = response);
    }
  } catch (error) {
    console.log(error);
    ctx.error(401, { message: "Internal error!" });
  }
};

const deleteOTP = async (ctx) => {
  try {
    console.log("What was you like ?");
    const { verification_key, check } = ctx.request.body;

    let decoded;

    try {
      decoded = await decode(verification_key);
    } catch (err) {
      const response = { Status: "Failure", Details: "Bad Request" };
      // return res.status(400).send(response);
      ctx.body = response;
    }
    let obj = JSON.parse(decoded);
    const check_obj = obj.check;

    if (check_obj != check) {
      const response = {
        Status: "Failure",
        Details: "OTP was not sent to this particular  phone number",
      };
      ctx.body = response;
      // return res.status(400).send(response);
    }
    let params = {
      id: obj.otp_id,
    };

    //   const deletedOTP = await select(
    //     "delete from otp where id = $1 returning id",
    //     params.id
    //   );
    const deletedOTP = await Otp.destroy({
      where: {
        id: params.id,
      },
    });
    if (!deletedOTP) {
      // return res.status(400).send("Invalid OTP");
      ctx.body = "Invalid OTP";
    }
    //   return res.status(200).send(params);
    ctx.body = params;
  } catch (error) {
    console.log(error.message);
  }
};

const getOTPByID = async (ctx) => {
  let params = {
    id: ctx.params.id,
  };
  //   const otpResult = await select("select * from otp where id = $1", params.id);
  const otpResult = await Otp.findByPk(id);
  const result = otpResult;
  if (!otpResult) {
    // return res.status(400).send("Invalid OTP");
    ctx.body = "invalid OTP";
  }
  ctx.body = result;
  //   return res.status(200).send(result);
};

module.exports = {
  getOtpies,
  getOtp,
  deleteOtp,
  newOTP,
  verifyOTP,
  deleteOTP,
  getOTPByID,
};
