const { default: mongoose } = require("mongoose");
const { ACCESS_TOKEN_EXPIRY } = require("../../../secret");
const ProfileModel = require("../../models/User/ProfileModel");
const UserModel = require("../../models/User/UserModel");
const findService = require("../../services/findService");
const readProfileService = require("../../services/readProfileService");
const updateService = require("../../services/updateService");
const createOTP = require("../../utilities/createOTP");
const createToken = require("../../utilities/createToken");
const customError = require("../../utilities/customError");
const isValidEmail = require("../../utilities/isValidEmail");
const sendEmail = require("../../utilities/sendEmail");

const sendOTP = async (req, res, next) => {
  try {
    const { email } = req.params;

    // checking email is valid or not
    const isValid = isValidEmail(email);
    if (!isValid) throw customError("invalid email address", 400);

    const code = createOTP();
    const option = {
      to: email,
      text: `Your otp code is = ${code}`,
      subject: "Email verification",
    };

    const query = { email };
    const updatedData = { otp: code };
    const options = { upsert: true };

    await updateService(UserModel, query, updatedData, options);
    await sendEmail(option);

    // everything is ok now send success response to client
    res.status(200).json({
      status: "ok",
      msg: "OTP code send successfully",
    });
  } catch (error) {
    next(error);
  }
};

const verifyOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.params;

    // checking email is valid or not
    const isValid = isValidEmail(email);
    if (!isValid) throw customError("invalid email address", 400);

    // checking otp is valid or not
    if (otp < 100000 || otp > 999999) {
      throw customError("invalid otp code", 400);
    }

    // find user in my user model
    const matchQuery = { email, otp };
    const user = await findService(UserModel, matchQuery);

    if (!user) throw customError("invalid email and otp", 400);
    const { _id, email: userEmail } = user;
    const tokenData = {
      _id,
      email: userEmail,
    };
    const tokenOptions = { expiresIn: ACCESS_TOKEN_EXPIRY };
    const token = createToken(tokenData, tokenOptions);

    // update user collection
    user.otp = 0;
    await user.save();

    // set cookie in user browser
    res.cookie("token", `Bearer ${token}`, {
      expires: new Date(Date.now() + Number(ACCESS_TOKEN_EXPIRY)),
      secure: true,
    });

    // everything is ok now send success response to client
    res.status(200).json({
      status: "ok",
      msg: "OTP verify successfully",
      token,
    });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    // set cookie in user browser
    res.cookie("token", "", {
      expires: new Date(Date.now() - Number(ACCESS_TOKEN_EXPIRY)),
      secure: true,
    });

    // everything is ok now send success response to client
    res.status(200).json({
      status: "ok",
      msg: "logout successfully",
    });
  } catch (error) {
    next(error);
  }
};

const createProfile = async (req, res, next) => {
  try {
    const userID = req.headers._id;
    const reqBody = req.body;
    reqBody.userID = userID;

    const query = { userID };
    const options = { upsert: true };
    const data = await updateService(ProfileModel, query, reqBody, options);
    // everything is ok now send success response to client
    res.status(200).json({
      msg: "success",
      data,
    });
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const userID = req.headers._id;
    const reqBody = req.body;
    reqBody.userID = userID;

    const query = { userID };
    const options = { upsert: true };
    const data = await updateService(ProfileModel, query, reqBody, options);
    // everything is ok now send success response to client
    res.status(200).json({
      msg: "success",
      data,
    });
  } catch (error) {
    next(error);
  }
};

const readProfile = async (req, res, next) => {
  try {
    const userID = req.headers._id;
    const matchQuery = { userID: new mongoose.Types.ObjectId(userID) };

    const data = await readProfileService(ProfileModel, matchQuery);
    // everything is ok now send success response to client
    res.status(200).json({
      msg: "success",
      data,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  sendOTP,
  verifyOTP,
  logout,
  createProfile,
  updateProfile,
  readProfile,
};
