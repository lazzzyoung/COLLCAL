const { ObjectId } = require('mongodb');
const connectDB = require('../database');

let db;
connectDB.then((client) => {
    db = client.db(process.env.DB_NAME); 
}).catch((err) => {
    console.error("Database connection failed:", err);
    throw { status: 500, message: "Database connection failed" };
});

//category 는 int 형으로 1 = 전필, 2 = 전선, 3 = 전기, 4 = 교필, 5 = 배분이수, 6 = 자유이수 로 나뉨
const categoryMap = {
    1: 'coreMajor',
    2: 'electiveMajor',
    3: 'basicMajor',
    4: 'coreLiberal',
    5: 'electiveLiberal',
    6: 'freeLiberal'
}

exports.getSubject = async (req,res) =>{
    try{
        const category = parseInt(req.query.category);
        const userId = req.token.userId;
        
        
        if(category < 1 || category > 6){
            return res.status(400).json({ message: '유효하지 않은 카테고리입니다.' });
        }
        
        
        const collectionName = categoryMap[category];
        if (!collectionName) {
            return res.status(400).json({ message: '존재하지 않는 카테고리입니다.' });
        }

        const subjects = await db.collection(collectionName).find({userId : new ObjectId(userId) }).toArray();
        if (subjects.length === 0) {
            return res.status(200).json({
                message: "등록된 과목이 없습니다.",
                subjects: []
            });
        } else {
            return res.status(200).json({
                message: "세부 과목 조회 완료",
                subjects: subjects
            })
        }
    } catch (error) {
        console.error('세부 과목 조회 오류:', error);
        res.status(500).json({ message: '서버 오류 발생' });
    }
}

exports.postSubject = async (req, res) =>{
    try {

        const userId = req.token.userId;
        
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

exports.editSubject = async (req,res) =>{
    try {
        const userId = req.token.userId;
        
            
        const {
            subjectId,
            category,
            subject,
            credit,
            gpa
        } = req.body;
        
        if(!subjectId) {
            console.log('과목 고유 id 식별 실패.')
            return res.status(400).json({ message: '수정하려는 과목을 반드시 선택해주세요.'})
        }
        if (!category) {
            return res.status(400).json({ message: "카테고리를 선택해주세요." });
        }
        if (
            !subject||
            !credit||
            !gpa
        ) {
            console.log("Subject edit failed : 수정할 필드를 최소 하나는 입력해주세요.")
            return res.status(400).json({message: "수정할 필드를 최소 하나는 입력해주세요."})
        }
        
        const collectionName = categoryMap[category];
        if (!collectionName) {
            return res.status(400).json({ message: "유효하지 않은 카테고리입니다." });
        }

        const targetSubject = await db.collection(collectionName).findOne(
            {
                _id: new ObjectId(subjectId),
                userId: new ObjectId(userId)
            });
        const updateFields = {};
        if (subject) updateFields.subject = subject;
        if (credit) updateFields.credit = credit;
        if (gpa) updateFields.gpa = gpa;

        if(!targetSubject) {
            console.log("존재하지 않는 과목입니다..")
            return res.status(400).json({message: "존재하지 않는 과목입니다."})
        } 

        await db.collection(collectionName).updateOne(
            { _id: new ObjectId(subjectId)},
            { $set: updateFields }
        );

        console.log("과목 정보 수정 완료")
        return res.status(200).json({ message: '성공적으로 업데이트되었습니다.' });
    } catch (error) {
        console.error('과목 수정 오류:', error);
        res.status(500).json({ message: '서버 오류 발생' });
    }

}

exports.deleteSubject = async (req,res) =>{
    try{
        const userId = req.token.userId;
        const subjectId = req.query.subjectId;
        const category = parseInt(req.query.category);

        if(!subjectId) {
            console.log('과목 고유 id 식별 실패.')
            return res.status(400).json({ message: '삭제하려는 과목을 반드시 선택해주세요.'})
        }
        if (!category) {
            return res.status(400).json({ message: "카테고리를 선택해주세요." });
        }

        
        const collectionName = categoryMap[category];
        if (!collectionName) {
            return res.status(400).json({ message: "유효하지 않은 카테고리입니다." });
        }

        const result = await db.collection(collectionName).deleteOne({
            _id : new ObjectId(subjectId),
            userId : new ObjectId(userId)
        })
        if(result.deletedCount === 1){
            console.log('과목 삭제 완료');
            return res.status(200).json({message: '과목 삭제 완료'})
        } else {
            console.log('과목 삭제 실패');
            return res.status(200).json({message: '과목 삭제 실패'})
        }
        
    } catch (error){
        console.error('과목 삭제 오류:', error);
        res.status(500).json({ message: '서버 오류 발생' });
    }
}
