const listServiceJoinWithBrandAndCategory = (
  Model,
  matchQuery,
  page,
  limit
) => {
  // convert to real number
  const pageNumber = Number(page) || 1;
  const limitNumber = Number(limit) || 20;
  const skipState = { $skip: (pageNumber - 1) * limitNumber };
  const limitState = { $limit: limitNumber };

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

  const unwindBrand = {
    $unwind: "$brand",
  };

  const unwindCategory = {
    $unwind: "$category",
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
    {
      $facet: {
        total: [matchQueryStage, { $count: "total" }],
        data: [
          matchQueryStage,
          skipState,
          limitState,
          joinWithBrandStage,
          joinWithCategoryStage,
          unwindBrand,
          unwindCategory,
          projection,
        ],
      },
    },
  ]);
};

module.exports = listServiceJoinWithBrandAndCategory;
