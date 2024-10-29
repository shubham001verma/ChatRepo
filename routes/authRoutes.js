
const express = require('express');
const upload = require('../middleware/Multer')
const {
    signup,
    login,
    getAllUsers,
    getUser,
    updateUser,
    deleteUser,
    logoutUser
} = require('../controllers/authController')

const router = express.Router();

router.post('/signup',upload.single("uploadImage"), signup);
router.post('/login', login);
router.get('/users', getAllUsers); 
router.get('/users/:id', getUser); 
router.put('/update/:id',upload.single("uploadImage"), updateUser); 
router.delete('/users/:id', deleteUser); 
router.get('/logout', logoutUser);

module.exports = router;
