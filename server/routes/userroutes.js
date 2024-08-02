
const express = require('express');
const { user_list, signup, signin } = require('../controllers/user.controller');
const router = express.Router();
const jwt= require('jsonwebtoken')

router.get('/',user_list );
router.post('/sign-up',signup );
router.post('/sign-in',signin);
module.exports = router;