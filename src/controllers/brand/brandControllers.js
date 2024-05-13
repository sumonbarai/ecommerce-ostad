const BrandModel = require("../../models/Brand/BrandModel");
const listService = require("../../services/listService");

const brandList = async (req, res, next) => {
  try {
    const data = await listService(BrandModel);

    // send all data list to client
    res.status(200).json({
      msg: "success",
      data,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { brandList };
