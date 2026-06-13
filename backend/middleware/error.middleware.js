const errorMiddleware = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;

    console.error(err);

    // 1. Mongoose CastError (Invalid ObjectId)
    if (err.name === 'CastError') {
        error.message = `Resource not found. Invalid ${err.path}`;
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }

    // 2. MongoDB Duplicate Key Error (code: 11000)
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        error.message = `${field} already exists`;
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }

    // 3. Mongoose Validation Error
    if (err.name === 'ValidationError') {
        error.message = Object.values(err.errors)
            .map(val => val.message)
            .join(', ');
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }

    // 4. Default (Server Error)
    res.status(err.statusCode || 500).json({
        success: false,
        code: "USER_MESSAGE",
        message: "Internal Server Error"
    });
};

export default errorMiddleware;
