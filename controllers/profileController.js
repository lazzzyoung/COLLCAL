const { ObjectId } = require('mongodb');
const connectDB = require('../database');

let db;
connectDB.then((client) => {
    db = client.db(process.env.DB_NAME); 
}).catch((err) => {
    console.error("Database connection failed:", err);
    throw { status: 500, message: "Database connection failed" };
});

//category 는 int 형으로 1 = 전필, 2 = 전선, 3 = 교양필수, 4 = 배분이수 로 나뉨
const categoryMap = {
    1: 'coreMajor',
    2: 'electiveMajor',
    3: 'basicMajor',
    4: 'coreLiberal',
    5: 'electiveLiberal',
    6: 'freeLiberal'
}

// 성적을 제외한 카테고리(전필,교양 선택), 과목, 몇학점짜리인지 입력을 받아옴
exports.postSubject = async (req, res) =>{
    try {

        const userId = req.token.userId;
        const user = await db.collection('users').findOne({_id : new ObjectId(userId)});
        
        if(!user) {
            console.log("해당 유저를 찾을 수 없습니다.");
            return res.status(404).json({ message: '사용자 정보를 찾을 수 없습니다.' });
        }
        const {
            category,
            subject,
            credit,
            gpa
        } = req.body;

        if (
            !category||
            !subject||
            !credit||
            !gpa
        ) {
            console.log("GPA registeration failed : 모든 필드값 입력 필요")
            return res.status(400).json({message: "모든 필드를 입력해주세요."})
        }

        const collectionName = categoryMap[category];
        if (!collectionName) {
            return res.status(400).json({ message: "유효하지 않은 카테고리입니다." });
        }

        const existSubject = await db.collection(collectionName).findOne({ 
            userId : new ObjectId(userId),
            subject 
        });

        if(!existSubject) {
            await db.collection(collectionName).insertOne({
                userId : new ObjectId(userId),
                subject,
                credit,
                gpa
            })
            console.log(`${collectionName}에 ${subject} 과목 추가 완료.`)
            return res.status(200).json({message: "과목이 정상적으로 추가되었습니다."})
        } else {
            console.log("이미 등록된 과목은 추가할 수 없습니다.")
            return res.status(400).json({message: "이미 등록되어 있는 과목입니다."})
        }
        
    } catch (err) {
        console.error(" postSubject error:", err);
        return res.status(500).json({ message: "서버 오류가 발생했습니다." });
    }

}


