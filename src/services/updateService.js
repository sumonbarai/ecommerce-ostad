const updateService = (Model, query, updatedData, options = {}) => {
  const modelOptions = {
    runValidators: true,
    new: true,
    ...options,
  };
  return Model.findOneAndUpdate(query, updatedData, modelOptions);
};

module.exports = updateService;
