
const express = require('express');

const verifyUser = require('../utils/verifyUser');
const { test, updateUser } = require('../controllers/user.controller');
const router = express.Router()

router.get('/', test)
router.post('/update/:id', verifyUser ,updateUser)


module.exports = router;