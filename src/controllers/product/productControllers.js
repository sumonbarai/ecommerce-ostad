const { default: mongoose } = require("mongoose");
const ProductSliderModel = require("../../models/Product/ProductSliderModel");
const listService = require("../../services/listService");
const ProductModel = require("../../models/Product/ProductModel");

const listServiceJoinWithBrandAndCategory = require("../../services/listServiceJoinWithBrandAndCategory");
const productDetailService = require("../../services/productDetailService");
const ReviewModel = require("../../models/Review/ReviewModel");
const productReviewListService = require("../../services/productReviewListService");

const productSliderList = async (req, res, next) => {
  try {
    const data = await listService(ProductSliderModel);

    // send all slider list to client
    res.status(200).json({
      msg: "success",
      data,
    });
  } catch (error) {
    next(error);
  }
};

const productListByBrand = async (req, res, next) => {
  try {
    const brandID = new mongoose.Types.ObjectId(req.params.brandID);
    const { page } = req.query;
    const { limit } = req.query;
    const matchQuery = { brandID };
    const data = await listServiceJoinWithBrandAndCategory(
      ProductModel,
      matchQuery,
      page,
      limit
    );
    // send all data list to client
    res.status(200).json({
      msg: "success",
      data,
    });
  } catch (error) {
    next(error);
  }
};

const productListByCategory = async (req, res, next) => {
  try {
    const { page } = req.query;
    const { limit } = req.query;
    const categoryID = new mongoose.Types.ObjectId(req.params.categoryID);
    const matchQuery = { categoryID };
    const data = await listServiceJoinWithBrandAndCategory(
      ProductModel,
      matchQuery,
      page,
      limit
    );

    // send all data list to client
    res.status(200).json({
      msg: "success",
      data,
    });
  } catch (error) {
    next(error);
  }
};

const productListByRemark = async (req, res, next) => {
  try {
    const { remark } = req.params;
    const { page } = req.query;
    const { limit } = req.query;
    const matchQuery = { remark };
    const data = await listServiceJoinWithBrandAndCategory(
      ProductModel,
      matchQuery,
      page,
      limit
    );

    // send all data list to client
    res.status(200).json({
      msg: "success",
      data,
    });
  } catch (error) {
    next(error);
  }
};

const productListBySimilar = async (req, res, next) => {
  try {
    const categoryID = new mongoose.Types.ObjectId(req.params.categoryID);
    const { page } = req.query;
    const { limit } = req.query;
    const matchQuery = { categoryID };
    const data = await listServiceJoinWithBrandAndCategory(
      ProductModel,
      matchQuery,
      page,
      limit
    );

    // send all data list to client
    res.status(200).json({
      msg: "success",
      data,
    });
  } catch (error) {
    next(error);
  }
};

const productDetails = async (req, res, next) => {
  try {
    const productID = new mongoose.Types.ObjectId(req.params.productID);
    const matchQuery = { _id: productID };
    const data = await productDetailService(ProductModel, matchQuery);

    // send all data list to client
    res.status(200).json({
      msg: "success",
      data,
    });
  } catch (error) {
    next(error);
  }
};

const productListByKeyword = async (req, res, next) => {
  try {
    const { page } = req.query;
    const { limit } = req.query;
    const { keyword } = req.params;
    const regex = { $regex: keyword, $options: "i" };
    const matchQuery = { $or: [{ title: regex }, { shortDes: regex }] };
    const data = await listServiceJoinWithBrandAndCategory(
      ProductModel,
      matchQuery,
      page,
      limit
    );

    // send all data list to client
    res.status(200).json({
      msg: "success",
      data,
    });
  } catch (error) {
    next(error);
  }
};

const productReviewList = async (req, res, next) => {
  try {
    const { page } = req.query;
    const { limit } = req.query;
    const productID = new mongoose.Types.ObjectId(req.params.productID);
    const matchQuery = { productID };

    const data = await productReviewListService(
      ReviewModel,
      matchQuery,
      page,
      limit
    );

    // send all data list to client
    res.status(200).json({
      msg: "success",
      data,
    });
  } catch (error) {
    next(error);
  }
};

const createProductReview = async (req, res, next) => {
  try {
    const userID = req.headers._id;
    const { productID, des, rating } = req.body;

    const data = await ReviewModel.create({
      userID,
      productID,
      des,
      rating,
    });

    // send all data list to client
    res.status(200).json({
      msg: "success",
      data,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  productSliderList,
  productListByBrand,
  productListByCategory,
  productListByRemark,
  productListBySimilar,
  productDetails,
  productListByKeyword,
  productReviewList,
  createProductReview,
};
