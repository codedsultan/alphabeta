import ResponseMessages from "../../../../contants/responseMessages.js";
import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import ErrorHandler from "../../../../helpers/errorHandler.js";
import models from "../../../../models/index.js";
import utility from "../../../../utils/utility.js";

/// @route GET /api/v1/search-user

const searchUser = catchAsyncError(async (req, res, next) => {
  const { q } = req.query;

  if (!q) {
    return next(new ErrorHandler(ResponseMessages.SEARCH_QUERY_REQUIRED, 400));
  }

  let currentPage = parseInt(req.query.page) || 1;
  let limit = parseInt(req.query.limit) || 20;

  const totalUsers = await models.User.find(
    {
      $or: [
        {
          uname: new RegExp(q, "gi"),
        },
        {
          fname: new RegExp(q, "gi"),
        },
        {
          lname: new RegExp(q, "gi"),
        }
      ],
    }).select("_id uname").countDocuments();

  let totalPages = Math.ceil(totalUsers / limit);

  if (totalPages <= 0) {
    totalPages = 1;
  }

  if (currentPage <= 1) {
    currentPage = 1;
  }

  if (totalPages > 1 && currentPage > totalPages) {
    currentPage = totalPages;
  }

  let skip = (currentPage - 1) * limit;

  let prevPageIndex = null;
  let hasPrevPage = false;
  let prevPage = null;
  let nextPageIndex = null;
  let hasNextPage = false;
  let nextPage = null;

  if (currentPage < totalPages) {
    nextPageIndex = currentPage + 1;
    hasNextPage = true;
  }

  if (currentPage > 1) {
    prevPageIndex = currentPage - 1;
    hasPrevPage = true;
  }

  const baseUrl = `${req.protocol}://${req.get("host")}${req.originalUrl
    }`.split("?")[0];

  if (hasPrevPage) {
    prevPage = `${baseUrl}?page=${prevPageIndex}&limit=${limit}`;
  }

  if (hasNextPage) {
    nextPage = `${baseUrl}?page=${nextPageIndex}&limit=${limit}`;
  }

  const slicedUsers = await models.User.find(
    {
      $or: [
        {
          uname: new RegExp(q, "gi"),
        },
        {
          fname: new RegExp(q, "gi"),
        },
        {
          lname: new RegExp(q, "gi"),
        }
      ],
    }).select("_id uname createdAt")
    .sort({ uname: 1, createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const results = [];

  for (let user of slicedUsers) {
    const userData = await utility.getUserData(user._id, req.user);

    if (userData) {
      results.push(userData);
    }
  }

  res.status(200).json({
    success: true,
    currentPage,
    totalPages,
    limit,
    hasPrevPage,
    prevPage,
    hasNextPage,
    nextPage,
    results,
  });
});

export default searchUser;
