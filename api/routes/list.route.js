const express = require('express');
const {createList, deleteList} = require('../controllers/list.controller')
const verifyToken = require('../utils/verifyUser')
const router = express.Router();

router.post('/create', verifyToken, createList)
router.delete('/delete/:id', verifyToken, deleteList)


module.exports = router