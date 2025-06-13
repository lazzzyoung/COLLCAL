const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const user = require('../models/user')


exports.register = async (req,res) =>{
    try{
        const { 
            loginId, 
            password, 
            email, 
            phone, 
            schoolInfo 
        } = req.body;

        if (
            !loginId||
            !password||
            !email||
            !phone||
            !schoolInfo?.university||
            !schoolInfo?.studentId||
            !schoolInfo?.major||
            !schoolInfo?.grade
        ) {
            console.log("Registration failed : 모든 필드값 입력 필요.")
            return res.status(400).json({message:"모든 필드를 입력해주세요."})
        }

        if (!email.includes('@')) {
            console.log("Registration failed : 올바른 이메일 형식 입력 필요.")
            return res.status(400).json({ message: '이메일 형식이 올바르지 않습니다.' });
          }


        await user.userRegister(req.body);
        res.status(201).json({ message: '회원가입 성공' });
        
    } catch (err) {
        console.log("Registration failed : authController 서버 오류")
        const status = err.status || 500;
        const message = err.message || '서버 오류';
        return res.status(status).json({ message });
    }
}