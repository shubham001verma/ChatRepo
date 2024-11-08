
const express = require('express');
const upload = require('../middleware/Multer')
const {
    signup,
    login,
    getAllUsers,
    getUser,
    updateUser,
    deleteUser,
    logoutUser,
    block,
    unblock,
    checkblock
} = require('../controllers/authController')

const router = express.Router();



router.post('/signup',upload.single("uploadImage"), signup);
router.post('/login', login);
router.get('/users', getAllUsers); 
router.get('/users/:id', getUser); 
router.put('/update/:id',upload.single("uploadImage"), updateUser); 
router.put('/block',block);
router.put('/unblock',unblock);
router.get('/blocked/:userId/:selectedUserId',checkblock);
router.delete('/users/:id', deleteUser); 
router.post('/logout', logoutUser);

module.exports = router;
