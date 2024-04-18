const express = require('express');
const createList = require('../controllers/list.controller')
const verifyToken = require('../utils/verifyUser')
const router = express.Router();

router.post('/create', verifyToken, createList)


module.exports = router