const express = require('express');
const router = express.Router();
const { verifyAccessToken } = require('../config/jwt');
//controllers
const {
	register,
	login,
	refreshToken,
	logout,
	getUser,
} = require('../controller/auth.controller');

router.post('/register', register);
router.post('/login', login);
router.post('/refresh-token', refreshToken);
router.delete('/logout', logout);
router.get('/user', verifyAccessToken, getUser);

module.exports = router;
