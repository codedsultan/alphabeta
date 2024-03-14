import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import ErrorHandler from "../../../../helpers/errorHandler.js";
import ResponseMessages from "../../../../contants/responseMessages.js";
import models from "../../../../models/index.js";
import validators from "../../../../utils/validators.js";

/// @route   POST api/v1/report-user

const reportUser = catchAsyncError(async (req, res, next) => {
    let { userId, reportReason } = req.body;

    if (!userId) {
        return next(new ErrorHandler(ResponseMessages.USER_ID_REQUIRED, 400));
    }

    if (!reportReason) {
        return next(new ErrorHandler(ResponseMessages.REPORT_REASON_REQUIRED, 400));
    }

    if (!validators.isValidObjectId(userId)) {
        return next(new ErrorHandler(ResponseMessages.INVALID_USER_ID, 400));
    }

    if (userId.toString() === req.user._id.toString()) {
        return next(new ErrorHandler(ResponseMessages.CANNOT_REPORT_YOURSELF, 400));
    }

    const reporter = req.user._id;

    const userReport = await models.UserReport.create({
        user: userId,
        reporter,
        reportReason,
    });

    if (!userReport) {
        return next(new ErrorHandler(ResponseMessages.REPORT_NOT_CREATED, 500));
    }

    res.status(200).json({
        success: true,
        message: ResponseMessages.REPORT_CREATED,
        data: userReport,
    });
});

export default reportUser;
