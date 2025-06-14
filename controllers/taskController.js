const { ObjectId } = require('mongodb');
const connectDB = require('../database');

let db;
connectDB.then((client) => {
    db = client.db(process.env.DB_NAME); 
}).catch((err) => {
    console.error("Database connection failed:", err);
    throw { status: 500, message: "Database connection failed" };
});


exports.getTask = async (req,res) =>{
    try {const userId = req.token.userId;
        
        const tasks = await db.collection('tasks').find({userId: new ObjectId(userId)}).toArray();
        if(tasks.length === 0){
            console.log("조회 성공) 등록된 task 없음.")
            return res.status(200).json({
                message: "조회 성공) 등록된 task 없음.",
                tasks: []
            });
        }

        console.log("Task 조회 성공.");
        return res.status(200).json({
            message: "Task 조회 성공.",
            tasks: tasks
        })
    } catch (error) {
        console.error('task 조회 오류:', error);
        res.status(500).json({ message: '서버 오류 발생' });
    }
}

exports.postTask = async (req,res) =>{
    try{
        const userId = req.token.userId;
                
        const {
            taskCategory,
            title,
            note,
        } = req.body;

        if (
            !taskCategory||
            !title
        ) {
            console.log("Task registeration failed : 상세정보를 제외한 필드값 입력 필요")
            return res.status(400).json({message: "상세정보를 제외한 모든 필드를 입력해주세요."})
        }

        await db.collection('tasks').insertOne({
            userId : new ObjectId(userId),
            taskCategory,
            title,
            note,
            status: 0 // default 로 생성은 task란에서만 가능하기때문에 0으로 서버에서 초기화
        })
        return res.status(200).json({ message: "할 일이 성공적으로 추가되었습니다." });
    } catch (error){
        console.error(" taskController error:", error);
        return res.status(500).json({ message: "서버 오류가 발생했습니다." });
    }
}


