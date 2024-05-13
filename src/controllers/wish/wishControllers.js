const { default: mongoose } = require("mongoose");
const WishModel = require("../../models/Wish/WishModel");
const deleteService = require("../../services/deleteService");
const readWishListService = require("../../services/readWishListService");
const updateService = require("../../services/updateService");

const saveWishList = async (req, res, next) => {
  try {
    const userID = req.headers._id;
    const { productID } = req.params;
    const updatedData = { productID, userID };

    const query = { productID, userID };
    const options = { upsert: true };
    const data = await updateService(WishModel, query, updatedData, options);
    // everything is ok now send success response to client
    res.status(200).json({
      msg: "success",
      data,
    });
  } catch (error) {
    next(error);
  }
};

const removeWishList = async (req, res, next) => {
  try {
    const userID = req.headers._id;
    const { productID } = req.params;
    const query = { productID, userID };
    await deleteService(WishModel, query);

    // everything is ok now send success response to client
    res.status(200).json({
      msg: "remove success",
    });
  } catch (error) {
    next(error);
  }
};

const readWishList = async (req, res, next) => {
  try {
    const userID = req.headers._id;
    const { page } = req.query;
    const { limit } = req.query;
    const matchQuery = { userID: new mongoose.Types.ObjectId(userID) };

    const data = await readWishListService(WishModel, matchQuery, page, limit);

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
  saveWishList,
  removeWishList,
  readWishList,
};
