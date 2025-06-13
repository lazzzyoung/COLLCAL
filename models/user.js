


const connectDB = require('../database');
const bcrypt = require('bcrypt');

let db;
connectDB.then((client) => {
    db = client.db(process.env.DB_NAME); // DB 초기화
}).catch((err) => {
    console.error("Database connection failed:", err);
    throw { status: 500, message: "Database connection failed" };
});


exports.userRegister = async (body) => {
    try{
        const {
            loginId,
            password,
            email,
            phone,
            schoolInfo
        } = body;

        const userExist = await db.collection('user').findOne({ email });
        
        if (userExist) {
            console.log("이미 가입된 이메일 입니다.");
            throw {status : 409 , message : "이미 가입된 이메일 입니다."}
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        await db.collection('users').insertOne({loginId,password :hashedPassword,email,phone});
        const user = await db.collection('users').findOne({email});
        

        const result = await db.collection('profiles').insertOne({ 
            _id: user._id ,  
            schoolInfo 
          });
    } catch (err) {
        console.log("Registration failed : userModel 서버 오류")
        throw {status : 500 , message : "서버 오류"}
    }
}

// module.exports = {
//     userRegister,
// };