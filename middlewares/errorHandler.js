function errorHandler(err, req, res, next){
    console.error(err.stack);

    const status = err.status || 500;
    const message = err.message || '서버 오류';

    res.status(status).json({
        "success": false,
        "error": {
            "status": status,
            "message": message
        }
    })
}

module.exports = errorHandler;