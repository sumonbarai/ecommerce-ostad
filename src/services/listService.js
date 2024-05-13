const listService = (Model, matchQuery = {}, projection = "") => {
  if (!projection) {
    return Model.find(matchQuery);
  }
  return Model.find(matchQuery, projection);
};

module.exports = listService;
