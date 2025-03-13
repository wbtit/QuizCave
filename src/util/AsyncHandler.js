export const AsyncHandler = (fn) => async (req, res, next) => {
    try {
        return await fn(req, res, next);
    } catch (error) {
        res.status(error.status || 500).json({
            success: false,
            message: error.message,
        })
    }
}