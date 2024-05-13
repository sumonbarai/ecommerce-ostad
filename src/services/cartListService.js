const cartListService = (Model, matchQuery) => {
  const matchQueryStage = {
    $match: matchQuery,
  };
  const joinWithProduct = {
    $lookup: {
      from: "products",
      localField: "productID",
      foreignField: "_id",
      as: "product",
    },
  };

  const joinWithBrandStage = {
    $lookup: {
      from: "brands",
      localField: "product.brandID",
      foreignField: "_id",
      as: "brand",
    },
  };
  const joinWithCategoryStage = {
    $lookup: {
      from: "categories",
      localField: "product.categoryID",
      foreignField: "_id",
      as: "category",
    },
  };

  const unwindProduct = {
    $unwind: "$product",
  };

  const unwindBrand = {
    $unwind: "$brand",
  };

  const unwindCategory = {
    $unwind: "$category",
  };

  const projection = {
    $project: {
      createdAt: 0,
      updatedAt: 0,
      userID: 0,
      "product._id": 0,
      "product.categoryID": 0,
      "product.brandID": 0,
      "product.createdAt": 0,
      "product.updatedAt": 0,
      "brand.createdAt": 0,
      "brand.updatedAt": 0,
      "brand._id": 0,
      "category._id": 0,
      "category.createdAt": 0,
      "category.updatedAt": 0,
    },
  };

  return Model.aggregate([
    matchQueryStage,
    joinWithProduct,
    joinWithBrandStage,
    joinWithCategoryStage,
    unwindProduct,
    unwindBrand,
    unwindCategory,
    projection,
  ]);
};

module.exports = cartListService;
