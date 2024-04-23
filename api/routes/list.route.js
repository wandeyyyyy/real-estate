const express = require('express');
const {createList, deleteList, updateList, getList, getListings} = require('../controllers/list.controller')
const verifyUser = require('../utils/verifyUser')
const router = express.Router();

router.post('/create', verifyUser, createList)
router.delete('/delete/:id', verifyUser, deleteList)
router.post('/update/:id', verifyUser, updateList)
router.get('/get/:id',  getList)
router.get('/get',  getListings)



module.exports = router