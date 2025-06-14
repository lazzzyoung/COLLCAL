const express = require('express');
const router = express.Router();
const authorization = require('../middlewares/authHandler');
const { getTask, postTask  } = require('../controllers/taskController');

router.get('/detail', authorization, getTask);
router.post('/register', authorization, postTask);
// router.patch('/update', authorization, editSubject);
// router.delete('/delete', authorization, deleteSubject);


module.exports = router;


