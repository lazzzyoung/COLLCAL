const express = require('express');
const router = express.Router();
const authorization = require('../middlewares/authHandler');
const { getTask, postTask, editTask, deleteTask  } = require('../controllers/taskController');

router.get('/detail', authorization, getTask);
router.post('/register', authorization, postTask);
router.patch('/update', authorization, editTask);
router.delete('/delete', authorization, deleteTask);


module.exports = router;


