
const express = require('express');
const upload = require('../middleware/Multer')
const {
    verifyOTP,
    signup,
    login,
    forgetPassword,
    resetPassword,
    getAllUsers,
    getUser,
    updateUser,
    deleteUser,
    logoutUser,
    block,
    unblock,
    checkblock,
    checkblockuser,
    isblock
} = require('../controllers/authController')

const router = express.Router();


router.post('/verify-otp', verifyOTP);
router.post('/signup',upload.single("uploadImage"), signup);
router.post('/login', login);
router.post('/forget-password',forgetPassword);
router.post('/reset-password',resetPassword);
router.get('/users', getAllUsers); 
router.get('/users/:id', getUser); 
router.put('/update/:id',upload.single("uploadImage"), updateUser); 
router.put('/block',block);
router.put('/unblock',unblock);
router.get('/blockeduser/:userId/:selectedUserId',checkblockuser);
router.get('/blocked/:userId/:selectedUserId',checkblock);
router.get('/isBlocked/:userId',isblock);
router.delete('/users/:id', deleteUser); 
router.post('/logout', logoutUser);

module.exports = router;
