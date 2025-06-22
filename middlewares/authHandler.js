const jwt = require('jsonwebtoken');

function authHandler(req, res, next) {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: '인증 토큰이 제공되지 않았습니다.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        req.token = decoded;
        next();
    } catch {
        res.status(403).json({ message: '유효하지 않은 토큰입니다.' });
    }
}

module.exports = authHandler;