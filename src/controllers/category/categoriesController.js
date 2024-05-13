const CategoryModel = require("../../models/Category/CategoryModel");
const listService = require("../../services/listService");

const categoryList = async (req, res, next) => {
  try {
    const data = await listService(CategoryModel);

    // send all data list to client
    res.status(200).json({
      msg: "success",
      data,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { categoryList };
