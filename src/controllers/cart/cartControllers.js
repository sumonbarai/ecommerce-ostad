const { default: mongoose } = require("mongoose");
const deleteService = require("../../services/deleteService");

const updateService = require("../../services/updateService");
const CartModel = require("../../models/Cart/CartModel");
const customError = require("../../utilities/customError");
const cartListService = require("../../services/cartListService");

const saveCartList = async (req, res, next) => {
  try {
    const userID = req.headers._id;
    const reqBody = req.body;
    reqBody.userID = userID;

    const query = { userID, productID: req.body.productID };
    const options = { upsert: true };
    const data = await updateService(CartModel, query, reqBody, options);
    // everything is ok now send success response to client
    res.status(200).json({
      msg: "success",
      data,
    });
  } catch (error) {
    next(error);
  }
};

const removeCartList = async (req, res, next) => {
  try {
    const userID = req.headers._id;
    const { productID } = req.params;
    const query = { productID, userID };
    const result = await deleteService(CartModel, query);

    // checking product exits or not
    if (!result) {
      throw customError("productID not found", 400);
    }

    // everything is ok now send success response to client
    res.status(200).json({
      msg: "remove success",
    });
  } catch (error) {
    next(error);
  }
};

const updateCartList = async (req, res, next) => {
  try {
    const userID = req.headers._id;
    const reqBody = req.body;
    reqBody.userID = userID;

    const query = { userID, productID: req.body.productID };
    const options = { upsert: true };
    const data = await updateService(CartModel, query, reqBody, options);
    // everything is ok now send success response to client
    res.status(200).json({
      msg: "success",
      data,
    });
  } catch (error) {
    next(error);
  }
};

const readCartList = async (req, res, next) => {
  try {
    const userID = req.headers._id;
    const matchQuery = { userID: new mongoose.Types.ObjectId(userID) };
    const data = await cartListService(CartModel, matchQuery);

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
  saveCartList,
  removeCartList,
  updateCartList,
  readCartList,
};
