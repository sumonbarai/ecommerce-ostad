const productDetailService = (Model, matchQuery) => {
  const matchQueryStage = {
    $match: matchQuery,
  };
  const joinWithBrandStage = {
    $lookup: {
      from: "brands",
      localField: "brandID",
      foreignField: "_id",
      as: "brand",
    },
  };
  const joinWithCategoryStage = {
    $lookup: {
      from: "categories",
      localField: "categoryID",
      foreignField: "_id",
      as: "category",
    },
  };
  const joinWithProductDetailsStage = {
    $lookup: {
      from: "productdetails",
      localField: "_id",
      foreignField: "productID",
      as: "productDetails",
    },
  };

  const unwindBrand = {
    $unwind: "$brand",
  };

  const unwindCategory = {
    $unwind: "$category",
  };
  const unwindProductDetails = {
    $unwind: "$productDetails",
  };

  const projection = {
    $project: {
      brandID: 0,
      categoryID: 0,
      createdAt: 0,
      updatedAt: 0,
      "brand.createdAt": 0,
      "brand.updatedAt": 0,
      "category.createdAt": 0,
      "category.updatedAt": 0,
    },
  };

  return Model.aggregate([
    matchQueryStage,
    joinWithBrandStage,
    joinWithCategoryStage,
    joinWithProductDetailsStage,
    unwindBrand,
    unwindCategory,
    unwindProductDetails,
    projection,
  ]);
};

module.exports = productDetailService;
