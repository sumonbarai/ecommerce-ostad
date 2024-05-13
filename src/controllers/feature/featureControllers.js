const FeaturesModel = require("../../models/Feature/FeaturesModel");
const listService = require("../../services/listService");

const featureList = async (req, res, next) => {
  try {
    const data = await listService(FeaturesModel);

    // send all data list to client
    res.status(200).json({
      msg: "success",
      data,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { featureList };
