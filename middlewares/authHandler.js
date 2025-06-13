function authHandler(req, res, next){
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).json({ message: '인증 토큰이 제공되지 않았습니다.' });
    }

    try{
        const decoded = jwt.verify(token,process.env.JWT_KEY);
        req.token = decoded;
        next();
    } catch {
        res.status(403).json({message: '유효하지 않은 토큰입니다.'});
    }
}
module.exports = authHandler;