const readProfileService = (Model, matchQuery) => {
  const matchQueryStage = {
    $match: matchQuery,
  };
  const joinWithUser = {
    $lookup: {
      from: "users",
      localField: "userID",
      foreignField: "_id",
      as: "user",
    },
  };

  const unwindUser = {
    $unwind: "$user",
  };

  const projection = {
    $project: {
      createdAt: 0,
      updatedAt: 0,
      "user.otp": 0,
      "user.createdAt": 0,
      "user.updatedAt": 0,
    },
  };

  return Model.aggregate([
    matchQueryStage,
    joinWithUser,
    unwindUser,
    projection,
  ]);
};

module.exports = readProfileService;
