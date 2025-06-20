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

        if (!taskCategory) {
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

exports.editTask = async (req, res) =>{
    try {
        const userId = req.token.userId;
        const {
            taskId,
            taskCategory,
            title,
            note,
            status
        } = req.body;

        if(!taskId) {
            console.log('task 고유 id 식별 실패.')
            return res.status(400).json({ message: '수정하려는 task가 존재하지않습니다.'})
        }
        if(
            !taskCategory&&
            !title&&
            !note&&
            !status
        ) {
            console.log('Task edit failed: 수정할 필드를 최소 하나는 입력해주세요.')
            return res.status(400).json({ message: '수정할 필드를 최소 하나는 입력해주세요.'})
        }
        const updateFields = {};
        if(taskCategory) updateFields.taskCategory = taskCategory;
        if(title) updateFields.title = title;
        if(note) updateFields.note = note;
        if(status) updateFields.status = status;

        await db.collection('tasks').updateOne(
            {_id: new ObjectId(taskId)},
            {$set: updateFields}
        );

        console.log("task 정보 수정 완료")
        return res.status(200).json({ message: '성공적으로 업데이트되었습니다.' });
    } catch (error) {
        console.error('task 수정 오류:', error);
        res.status(500).json({ message: '서버 오류 발생' });
    }
}


exports.deleteTask = async (req,res)=>{
    try{
        const userId = req.token.userId;
        const taskId = req.query.taskId;

        if(!taskId) {
            console.log('task ID 누락');
            return res.status(400).json({ message: '삭제하려는 task을 반드시 선택해주세요.'})
        }
        const result = await db.collection('tasks').deleteOne({
                    _id : new ObjectId(taskId),
                    userId : new ObjectId(userId)
                })
                if(result.deletedCount === 1){
                    console.log('task 삭제 완료');
                    return res.status(200).json({message: 'task 삭제 완료'})
                } else {
                    console.log('task 삭제 실패');
                    return res.status(200).json({message: 'task 삭제 실패'})
                }
    } catch (error){
        console.error('과목 삭제 오류:', error);
        res.status(500).json({ message: '서버 오류 발생' });
    }
}