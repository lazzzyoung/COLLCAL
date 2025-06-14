const express = require('express');
const router = express.Router();
const authorization = require('../middlewares/authHandler');
const { postSubject } = require('../controllers/profileController');

router.post('/subject', authorization, postSubject);


module.exports = router;


