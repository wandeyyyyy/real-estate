
const express = require('express');

const verifyUser = require('../utils/verifyUser');
const { test, updateUser,  deleteUser, getUserListing } = require('../controllers/user.controller');
const router = express.Router()

router.get('/', test)
router.post('/update/:id', verifyUser ,updateUser)
router.delete('/delete/:id', verifyUser ,deleteUser)
router.get('/listings/:id', verifyUser, getUserListing)


module.exports = router;