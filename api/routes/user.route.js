
const express = require('express');

const verifyUser = require('../utils/verifyUser');
const { test, updateUser,  deleteUser, getUserListing, getUser } = require('../controllers/user.controller');
const router = express.Router()

router.get('/', test)
router.post('/update/:id', verifyUser ,updateUser)
router.delete('/delete/:id', verifyUser ,deleteUser)
router.get('/listings/:id', verifyUser, getUserListing)
router.get('/:id', verifyUser, getUser)


module.exports = router;