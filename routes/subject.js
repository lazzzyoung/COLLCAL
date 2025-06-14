const express = require('express');
const router = express.Router();
const authorization = require('../middlewares/authHandler');
const { getSubject, postSubject, editSubject, deleteSubject } = require('../controllers/subjectController');

router.get('/detail', authorization, getSubject);
router.post('/register', authorization, postSubject);
router.patch('/update', authorization, editSubject);
router.delete('/delete', authorization, deleteSubject);


module.exports = router;


