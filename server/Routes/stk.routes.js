const express = require('express');
const router = express.Router();

const { stk, CallBackURL, stkQuery } = require('../controller/stk.controller');

const generateAccessToken = require('../middleware/generateAccessToken');

router.post('/', generateAccessToken, stk);

router.post('/callback', CallBackURL);

router.post('/query', generateAccessToken, stkQuery);

module.exports = router;
