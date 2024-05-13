const LegalModel = require("../../models/Legal/LegalModel");
const listService = require("../../services/listService");

const legalsList = async (req, res, next) => {
  try {
    const data = await listService(LegalModel);

    // send all data list to client
    res.status(200).json({
      msg: "success",
      data,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { legalsList };
