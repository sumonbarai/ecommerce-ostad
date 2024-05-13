const findService = (Model, matchQuery = {}, projection = "") => {
  if (!projection) {
    return Model.findOne(matchQuery);
  }
  return Model.findOne(matchQuery, projection);
};

module.exports = findService;
