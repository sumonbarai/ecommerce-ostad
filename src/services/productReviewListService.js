const productReviewListService = (Model, matchQuery, page, limit) => {
  // convert to real number
  const pageNumber = Number(page) || 1;
  const limitNumber = Number(limit) || 20;
  const skipState = { $skip: (pageNumber - 1) * limitNumber };
  const limitState = { $limit: limitNumber };

  const matchQueryStage = {
    $match: matchQuery,
  };
  const joinWithProfile = {
    $lookup: {
      from: "profiles",
      localField: "userID",
      foreignField: "userID",
      as: "profile",
    },
  };

  const unwindProfile = {
    $unwind: "$profile",
  };

  const projection = {
    $project: {
      _id: 1,
      des: 1,
      ratting: 1,
      profile: 1,
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
          joinWithProfile,
          unwindProfile,
          projection,
        ],
      },
    },
  ]);
};

module.exports = productReviewListService;
