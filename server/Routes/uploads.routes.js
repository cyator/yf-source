const express = require('express');
const router = express.Router();

const { streamFile } = require('../controller/uploads.controller');

router.get('/:filename', streamFile);

module.exports = router;
