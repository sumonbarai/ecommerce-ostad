const deleteService = (Model, query, options = {}) => {
  const modelOptions = {
    ...options,
  };
  return Model.findOneAndDelete(query, modelOptions);
};

module.exports = deleteService;
