const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const connectDB = require('../database');

let db;
connectDB.then((client) => {
    db = client.db(process.env.DB_NAME); 
}).catch((err) => {
    console.error("Database connection failed:", err);
    throw { status: 500, message: "Database connection failed" };
});

// 클라이언트로부터 로그인정보를 받아옴.
exports.register = async (req,res) =>{
    try{
        const { 
            loginId, 
            password, 
            email, 
            phone, 
            university,
            studentId,
            major,
            status
        } = req.body;

        if (
            !loginId||
            !password||
            !email||
            !phone||
            !university||
            !studentId||
            !major||
            !status
        ) {
            console.log("Registration failed : 모든 필드값 입력 필요.")
            return res.status(400).json({message:"모든 필드를 입력해주세요."})
        }

        if (!email.includes('@')) {
            console.log("Registration failed : 올바른 이메일 형식 입력 필요.")
            return res.status(400).json({ message: '이메일 형식이 올바르지 않습니다.' });
          }

        //유효성 검사(이미 가입된 이메일인지 확인)
        const userExist = await db.collection('users').findOne({ email });
        if (userExist) {
            console.log("이미 가입된 이메일 입니다.");
            return res.status(409).json({ message: "이미 가입된 이메일 입니다." });
        }

        
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        
        await db.collection('users').insertOne(
            {
                loginId,
                password: hashedPassword,
                email,
                phone,
                university,
                studentId,
                major,
                status
            }
            );

    

        res.status(201).json({ message: '회원가입 성공' });
        
    } catch (err) {
        console.log("Registration failed 서버 오류")
        const status = err.status || 500;
        const message = err.message || '서버 오류';
        return res.status(status).json({ message });
    }
};

exports.login = async (req, res) => {
    
    const { loginId, password } = req.body; 
    if(!loginId || !password) {
        console.log("login 정보 누락")
        return res.status(400).json({message : "모든 필드를 입력해주세요."})
    }

    try {
        const user = await db.collection('users').findOne({loginId});
        if(!user) 
            return res.status(401).json({ message: '아이디 또는 비밀번호가 잘못되었습니다.' });

        const isPasswordValid = await bcrypt.compare(password,user.password);
        if(!isPasswordValid)
            return res.status(401).json({ message: '아이디 또는 비밀번호가 잘못되었습니다.' });

            
        const token = jwt.sign({ userId: user._id }, process.env.JWT_KEY, {
        expiresIn: '3d',
        });
        
        return res.status(200).json({
        message: '로그인 성공',
        token,
        });
    } catch (err) {
        console.log("Login failed 서버 오류")
        const status = err.status || 500;
        const message = err.message || '서버 오류';
        return res.status(status).json({ message });
    }
}

exports.logout = async (req,res) => {
    // Client 에서 토큰 만료 처리
    return res.status(200).json({ message: '로그아웃 되었습니다.' });
}